import cheerio, { CheerioAPI } from 'cheerio';
import dayjs from 'dayjs';
import request from 'request-promise';
import { client } from '../..';
import { tmdb } from '../../models/mongodb';
import { camelize, timestamp } from '../../utils/common';

export const dailyBoxOffice = async (title: string, year: string, tmdbID: number) => {
    try {
        const db = await client.db(tmdb.db).collection(tmdb.collection.movies)

        const result = await db.findOne({id: tmdbID});


        if(result && result.theNumbers && result.theNumbers.length) {
            const hours = dayjs().diff(dayjs(result.lastUpdated.seconds), 'hours')
        
           if(hours <= 24) {
            return result.theNumbers
           }
        }

        const createURI = ():string => {
            if(result && result.url) return result.url

            return  `https://www.the-numbers.com/movie/${title.replace(/[^a-zA-Z0-9,;\-.!? ]/g, ' ').replace(/\s+/g, '-')}-(${year})#tab=box-office`
        }


        const uri = createURI()

        const numbersOptions = {
            uri,
            transform: (body: string) => (
                cheerio.load(body)
            )
        }

        const numbersData = await request(numbersOptions) as CheerioAPI
        
        const collectiveTableData: any[] = []
        

       numbersData('#box-office').each((i, el) => {
            const titles: string[] = []
            const boxOffice = cheerio.load(el)

            const h2s = boxOffice(el).find('h2')

            h2s.each((i, el) => {
                if(i === 0) return true

                titles.push(boxOffice(el).text().trim())
            })

            numbersData('#box_office_chart').each((tableIndex, el) => {
                const loadTable = cheerio.load(el)
    
                const tableBody = loadTable('table > tbody > tr')
                const singularTableData: any = []
                const columns: any[] = []
                
               
                // pulls data out of table
                loadTable(tableBody).each((i, el) =>{
                    if(i === 0) {
                        const ths = loadTable(el).find('th')
                        ths.each((i, el) => {
                            if(loadTable(el).text()){
                                columns.push(camelize(loadTable(el).text().trim()))
                            }
                        })
                        return true
                    }
                    const rows = loadTable(el).find("td");
    
                    const numbers = (columns as any[]).reduce((acc, curr, index) => {
                        return {[curr]: loadTable(rows[index]).text().trim(), ...acc}
                    }, {})

    
                    singularTableData.push(numbers)
                })
    
                collectiveTableData.push({
                    title: titles[tableIndex],
                    data: singularTableData
                })
            })
       })



    await  db.updateOne({id: tmdbID},{ $set: {theNumbers: collectiveTableData, url: uri, lastUpdated: timestamp()}})

    return collectiveTableData
        

    } catch (error) {
        throw error;
    }
}