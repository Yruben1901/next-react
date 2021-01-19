import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(),'posts')

export function getSortedPostsData(){
  //Obtiene los nombres de archivos del directorio
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    //Elimina el ".md" del nombre de archivo para tomarlo como id...
    const id = fileName.replace(/\.md$/,'')

    //Leer el markdown como string
    const fullPath = path.join(postsDirectory,fileName)
    const fileContents = fs.readFileSync(fullPath,'utf8')

    //Parseo de los metadatos con matter
    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data
    }
  })

  return allPostsData.sort((a,b)=>{
    return a.date < b.date ? 1 : -1
  })
}