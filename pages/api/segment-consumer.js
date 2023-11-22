import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  // const session = await getSession({ req: req });
  // if (!session) {
  //   return res.status(401).end(`Not authenticated`);
  // }
  switch (req.method) {
    case 'POST':
    let catg_one = req.body.catg_one;
    let catg_two  = req.body.catg_two;
    let catg_three  = req.body.catg_three;
    let city = req.body.city;
    let locality = req.body.locality;
    let segmtFilter = req.body.segmtFilter;
    
    console.log("params........."+catg_one);
    
    const tableName_columnName = await db.query(
      `SELECT * FROM cs_indicator where geolevel='H8' and catg_three='`+catg_three+`' and catg_two='`+catg_two+`' and catg_one='`+catg_one+`' ORDER BY id ASC LIMIT 1`
      );
      
      let table_name = tableName_columnName[0].table_name;
      let column_in_table = tableName_columnName[0].columns_in_table;
      
      if(segmtFilter == 1){
        let catg_three_column = catg_three.split(" ").join("_").toLowerCase();
        console.log("catg_three_column: "+catg_three_column);
        const getHexId_val = await db.query(
          `SELECT hexgrid08.hexid08 as name,`+table_name+`.`+column_in_table+` as "`+catg_three_column+`", hexgrid08.id, hexgrid08.consumer_digital_expenditure, hexgrid08.t_name, hexgrid08.town_cd, hexgrid08.locality_id, hexgrid08.stat_cd FROM hexgrid08 FULL JOIN `+table_name+` ON hexgrid08.id = `+table_name+`.hex08_key WHERE hexgrid08.t_name = '`+city+`'`
          );
          
          let statCdArray = [];
          getHexId_val.forEach(element => {
            statCdArray.push(element.stat_cd);
          });
          
          let unique = statCdArray.filter(onlyUnique);
          const state_name = await db.query(`SELECT name FROM state where id='`+unique+`'`);
          console.log("state name "+JSON.stringify(state_name));
          for(let stateItr=0;stateItr<getHexId_val.length;stateItr++){
            getHexId_val[stateItr].state = state_name[0].name;
            getHexId_val[stateItr].locality = "Dummy";
            getHexId_val[stateItr].smtii0001 = getHexId_val[stateItr][catg_three_column];
          }
          
          var sortedResp = getHexId_val.sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
            return a.smtii0001 < b.smtii0001 ?  1 // if b should come earlier, push a to end
            : a.smtii0001 > b.smtii0001 ? -1 // if b should come later, push a to begin
            : 0;                   // a and b are equal
          });
          
          return res.status(200).json(sortedResp);
        }
        default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
    
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    
    export default handler;
    