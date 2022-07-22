import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';
import { camelize } from '../../utils/common';

export const dailyBoxOffice = async (title: string, year: string) => {
    try {
        const uri = `https://www.the-numbers.com/movie/${title.replace(/[^a-zA-Z0-9,;\-.!? ]/g, ' ').replace(/\s+/g, '-')}-(${year})#tab=box-office`
        console.log(uri)

        const numbersOptions = {
            uri,
            transform: (body: string) => (
                cheerio.load(body)
            )
        }

        const numbersData = await request(numbersOptions) as CheerioAPI
        const table = '#box-office > #box_office_chart'
        

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





        return collectiveTableData
        

    } catch (error) {
        throw error;
    }
}