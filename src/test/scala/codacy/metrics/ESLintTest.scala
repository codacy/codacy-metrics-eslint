package codacy.metrics

import better.files.File
import codacy.docker.api.Source
import codacy.docker.api.metrics.{FileMetrics, LineComplexity}
import com.codacy.api.dtos.Languages
import org.specs2.mutable.Specification

import scala.util.{Failure, Success}

class ESLintTest extends Specification {

  private val expectedTerryFoldMetrics =
    FileMetrics(
      "codacy/metrics/js/TerryFold.js",
      Some(7),
      nrMethods = None,
      lineComplexities = Set(LineComplexity(1, 7)))

  private val expectedLetMeOutMetrics =
    FileMetrics(
      "codacy/metrics/js/LetMeOut.js",
      Some(7),
      nrMethods = None,
      lineComplexities = Set(LineComplexity(1, 1), LineComplexity(5, 7)))

  private val expectedGetSchwiftyMetrics =
    FileMetrics(
      "codacy/metrics/js/GetSchwifty.js",
      Some(8),
      nrMethods = None,
      lineComplexities = Set(LineComplexity(3, 1), LineComplexity(7, 8)))

  private val targetDir = "src/test/resources/"
  private val scalaDir = "src/test/resources/codacy/metrics/other/"
  private val pathPrefix = (File(".") / scalaDir).toJava.getCanonicalPath

  "ESLint" should {

    "get metrics" in {
      "all files within a directory" in {
        val expectedFileMetrics = List(expectedTerryFoldMetrics, expectedGetSchwiftyMetrics, expectedLetMeOutMetrics)
        val fileMetrics =
          ESLint(
            source = Source.Directory(targetDir),
            languageOpt = Some(Languages.Javascript),
            files = None,
            options = Map.empty)

        fileMetrics must beLike {
          case Success(elems) =>
            elems must containTheSameElementsAs(expectedFileMetrics)
        }
      }

      "specific files" in {
        val expectedFileMetrics = List(expectedGetSchwiftyMetrics, expectedTerryFoldMetrics)

        val fileMetrics = ESLint(
          source = Source.Directory(targetDir),
          languageOpt = None,
          files =
            Some(Set(Source.File(expectedGetSchwiftyMetrics.filename), Source.File(expectedTerryFoldMetrics.filename))),
          options = Map.empty)

        fileMetrics must beEqualTo(Success(expectedFileMetrics))
      }
    }

    "fail" in {
      "scala files directory" in {
        val fileMetrics =
          ESLint(
            source = Source.Directory(scalaDir),
            languageOpt = Some(Languages.Javascript),
            files = None,
            options = Map.empty)

        fileMetrics must beLike {
          case Failure(e) =>
            val message = e.getMessage
            message must contain("ESLint exited with code 2")
            message must contain("Message: Premature end of file")
            message must contain(s"""No files matching the pattern "$pathPrefix" were found.""")
        }
      }
      "request analysis for scala language" in {
        val fileMetrics =
          ESLint(
            source = Source.Directory(scalaDir),
            languageOpt = Some(Languages.Scala),
            files = None,
            options = Map.empty)

        fileMetrics must beLike {
          case Failure(e) =>
            e.getMessage must beEqualTo(s"ESLint only supports Javascript. Provided language: ${Languages.Scala.name}")
        }
      }
    }
  }
}
