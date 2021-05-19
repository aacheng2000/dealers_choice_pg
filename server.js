//const pg = require('pg'); // we need pg
const {client, syncAndSeed} = require('./db');
const express = require('express');
const path = require('path')
const app = express();
//app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', async(req, res, next)=> {
	  try {
		      const response = await client.query('Select * from postings;');
		      const postings = response.rows;
		      res.send(`
          <html>
        <head>
	<link rel='stylesheet' href='/assets/styles.css'/>
      </head>
           <body>
          <h1>Sneaker World</h1>
    	<h2>Brands</h2>
        <ul>
          ${
           postings.map( posting => `
                 <li>
         <a href ='/postings/${posting.id}'>
               -  ${posting.title} 
        	-  ${ posting.company }
               -  ${posting.dateposted}
	       -  ${posting.salary}
	       </a>:
               </li>
            `).join('')
            }
            </ul>
          </body>
      </html>
          `);
		    }
	  catch(ex){
		      next(ex);
		    }
})

app.get('/postings/:id', async(req, res, next)=> {
	  try {
		      let response = await client.query('Select * from postings where id=$1;', [req.params.id]);
		      const postings = response.rows[0]
		      res.send(`
        <html>
        <head>
	
      </head>
          <body>
            <h1>Job World</h1>
    	<h2><a href = '/'>Back to Jobs List</a></h2>
        
          ${postings.title}<BR>
	  ${postings.company}<BR>
	  ${postings.description}
        </ul>
      </body>
          </html>
      `);
											    }
	  catch(ex){
		      next(ex);
		    }
})
const port = process.env.PORT || 8180


/*
const client = new pg.Client('postgres://localhost/jobs'); //we use pg client

const syncAndSeed = async()=> {
	  const SQL = `
      DROP TABLE IF EXISTS postings;
      CREATE TABLE postings(
      id INTEGER PRIMARY KEY,
      title varchar(100),
      company varchar(100),
      datepost  varchar(20),
      salary varchar(100),
      description varchar(1000)
    );
    INSERT INTO postings(id,title,company,datepost,salary,description) VALUES(1,'Analyst','IBM','1/1/2021','$1','lots of work') 
											      `;
	  await client.query(SQL);
}
*/
const setUp = async()=> { //we need to connect. we need to log out error if there is one
	  try {

		 await client.connect();
		      await syncAndSeed();
		      console.log('connected to database') //let us know if its connected
	      app.listen(port, ()=> console.log(`listening on port ${port}`));

	 }
	  catch(ex){
		      console.log(ex)
		    }
};

setUp()
