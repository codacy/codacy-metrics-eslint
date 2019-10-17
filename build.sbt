import com.typesafe.sbt.packager.docker.{Cmd, DockerAlias}

enablePlugins(JavaAppPackaging)
enablePlugins(DockerPlugin)
organization := "com.codacy"
scalaVersion := "2.13.1"
name := "codacy-metrics-eslint"
libraryDependencies ++= Seq(
  "com.codacy" %% "codacy-metrics-scala-seed" % "0.2.0",
  "org.scala-lang.modules" %% "scala-xml" % "1.2.0",
  "org.specs2" %% "specs2-core" % "4.8.0" % Test)

mappings in Universal ++= {
  (resourceDirectory in Compile).map { resourceDir: File =>
    val src = resourceDir / "docs"
    val dest = "/docs"

    for {
      path <- src.allPaths.get if !path.isDirectory
    } yield path -> path.toString.replaceFirst(src.toString, dest)
  }
}.value

dockerBaseImage := "openjdk:8-jre-alpine"
Docker / daemonUser := "docker"
Docker / daemonGroup := "docker"
dockerEntrypoint := Seq(s"/opt/docker/bin/${name.value}")
dockerCommands := dockerCommands.value.flatMap {
  case cmd @ Cmd("ADD", _) =>
    Seq(
      Cmd("RUN", "adduser -u 2004 -D docker"),
      cmd,
      Cmd(
        "RUN",
        "apk update && apk --no-cache add bash curl nodejs-npm && npm install -g npm@5 eslint@5.16.0 babel-eslint@10.0.3"),
      Cmd("ENV", "NODE_PATH /usr/lib/node_modules"),
      Cmd("RUN", "mv /opt/docker/docs /docs"))
  case other => List(other)
}
