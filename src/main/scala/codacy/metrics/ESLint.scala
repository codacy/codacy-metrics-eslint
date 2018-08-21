package codacy.metrics

import java.nio.charset.StandardCharsets
import java.nio.file.StandardOpenOption

import better.files._
import codacy.docker.api.metrics.{FileMetrics, LineComplexity, MetricsTool}
import codacy.docker.api.{MetricsConfiguration, Source}
import codacy.utils.XML
import com.codacy.api.dtos.{Language, Languages}
import com.codacy.docker.api.utils.{CommandResult, CommandRunner, FileHelper}

import scala.util.matching.Regex
import scala.util.{Failure, Properties, Try}
import scala.xml.{Elem, NodeSeq}

object ESLint extends MetricsTool {

  private val ComplexityRegex: Regex =
    """(?:Function|Constructor|Method)\s*.*?\s*has a complexity of (\d+). \(complexity\)""".r

  override def apply(source: Source.Directory,
                     languageOpt: Option[Language],
                     files: Option[Set[Source.File]],
                     options: Map[MetricsConfiguration.Key, MetricsConfiguration.Value]): Try[List[FileMetrics]] = {
    languageOpt match {
      case Some(language) if language != Languages.Javascript =>
        Failure(new Exception(s"ESLint only supports Javascript. Provided language: ${language.name}"))
      case _ =>
        withToolSetup(source, files) { (command, outputFile) =>
          CommandRunner.exec(command, Some(File(source.path).toJava)) match {
            case Right(resultFromTool) =>
              parseToolResult(outputFile, absolutePath(source.path)).recoverWith {
                case e => handleFailure(e, resultFromTool)
              }
            case Left(e) =>
              Failure(e)
          }
        }
    }
  }

  private def withToolSetup[T](source: Source.Directory, files: Option[Set[Source.File]])(
    fn: (List[String], File) => T): T = {
    val targetFiles: List[String] =
      files.fold(List(absolutePath(source.path)))(
        _.map(file => absolutePath(file.path, Some(source.path)))(collection.breakOut))
    (for {
      outputFile <- File.temporaryFile(suffix = ".xml")
      configFile <- File.temporaryFile(suffix = ".json")
    } yield {
      writeConfigFile(configFile)
      val toolConfiguration = List("-c", configFile.path.toString)
      val command = dockerCommand(outputFile, toolConfiguration, targetFiles)
      fn(command, outputFile)
    }).get()
  }

  private def dockerCommand(outputFile: File, toolConfiguration: List[String], targetFiles: List[String]) = {
    List(
      "eslint",
      "--no-eslintrc",
      "-f",
      "checkstyle",
      "--ext",
      ".js",
      "--ext",
      ".jsx",
      "-o",
      s"${outputFile.toJava.getCanonicalPath}") ++ toolConfiguration ++ targetFiles
  }

  private def writeConfigFile(file: File) = {
    val content =
      """{
         |  "env": {
         |    "es6": true,
         |    "node": true,
         |    "browser": true,
         |    "commonjs": true,
         |    "jquery": true,
         |    "phantomjs": true,
         |    "jasmine": true,
         |    "mocha": true,
         |    "amd": true,
         |    "worker": true,
         |    "qunit": true
         |  },
         |  "parser": "babel-eslint",
         |  "parserOptions": {
         |    "ecmaVersion": "2017",
         |    "ecmaFeatures": {
         |      "jsx": true
         |    }
         |  },
         |  "rules": {
         |    "complexity": [1, 0]
         |  }
         |}""".stripMargin

    file.write(content)(Seq(StandardOpenOption.CREATE), StandardCharsets.UTF_8)
  }

  private def parseComplexityMessage(message: String): Option[Int] = {
    message match {
      case ComplexityRegex(n) => Try(n.toInt).toOption
      case _                  => None
    }
  }

  private def parseToolResult(outputFile: File, sourcePath: String): Try[List[FileMetrics]] = {
    Try {
      val xmlParsed = XML.loadFile(outputFile.toJava)
      parseToolResult(xmlParsed, sourcePath)
    }.recoverWith {
      case e =>
        Failure(
          new Exception(
            s"""Message: ${e.getMessage}
               |FileContents:
               |${outputFile.contentAsString}""".stripMargin,
            e))
    }
  }

  private def parseToolResult(outputXml: Elem, sourcePath: String): List[FileMetrics] = {
    (outputXml \ "file").map { file =>
      val fileName = file \@ "name"
      val fileIssues: NodeSeq = file \ "error"
      val complexities: Seq[LineComplexity] = fileIssues.flatMap { issue =>
        val line = (issue \@ "line").toInt
        val message = issue \@ "message"
        parseComplexityMessage(message).map(LineComplexity(line, _))
      }
      FileMetrics(
        filename = FileHelper.stripPath(fileName, sourcePath),
        complexity = complexities.map(_.value).reduceOption(_ max _),
        loc = None,
        cloc = None,
        nrMethods = None,
        nrClasses = None,
        lineComplexities = complexities.toSet)
    }(collection.breakOut)
  }

  private def handleFailure(e: Throwable, resultFromTool: CommandResult): Try[List[FileMetrics]] = {
    val msg =
      s"""
         |ESLint exited with code ${resultFromTool.exitCode}
         |message: ${e.getMessage}
         |stdout: ${resultFromTool.stdout.mkString(Properties.lineSeparator)}
         |stderr: ${resultFromTool.stderr.mkString(Properties.lineSeparator)}
         |${e.getStackTrace.mkString(System.lineSeparator)}""".stripMargin
    Failure(new Exception(msg))
  }

  private def absolutePath(relativePath: String, prefix: Option[String] = None) = {
    prefix match {
      case Some(pref) =>
        (pref / relativePath).toJava.getCanonicalPath
      case None => File(relativePath).toJava.getCanonicalPath
    }

  }
}
