import ammonite.ops._
import java.io.File

val ignored = List(".git", ".gitignore", "README.md", "LICENSE", "main.js", "config.ini", "Build.sc")

object Build {

  def getListOfFiles(dir: String):List[File] = {
    val d = new File(dir)
    if (d.exists && d.isDirectory) {
        d.listFiles.toList
    } else {
        List[File]()
    }
  }

  def clean = {
    implicit val wd = pwd
    Build.getListOfFiles(".")
      .filter(f => !ignored.contains(f.getName))
      .foreach(f => %rm("-rf", wd / f.getName))
    this  
  }
  def frontend = {
    implicit val wd = pwd / up / "identity-webclient"
    %npm("run", "electron")
    this
  }
  def backend = {
    implicit val wd = pwd / up / "identity-server-js"
    %npm("run", "electron")
    this
  }
}

@main
def main(action: String, path: Path = pwd) = {
  if (action.contains("clean")) Build.clean
  if (action.contains("frontend")) Build.frontend
  if (action.contains("backend")) Build.backend
  if (action.contains("build")) Build.clean.frontend.backend
}

// amm -s --no-remote-logging Build.sc clean
// amm -s --no-remote-logging Build.sc build

