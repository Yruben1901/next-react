import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'


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

  //Ordena de mayor a menor los posts por fecha
  return allPostsData.sort((a,b)=>{
    return a.date < b.date ? 1 : -1
  })
}

export function getAllPostIds(){
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map(fileName => {
    return {
      params:{
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
