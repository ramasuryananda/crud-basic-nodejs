const { render } = require('ejs');
const express = require('express');
const app = express();
const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database:'list_app'
});

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));

con.connect((err)=>{
  if(err){
    console.log("Connection error"+err.stack);
    return;
  }
  // console.log('succes');
})

app.get('/',(req,res)=>{
  con.query(
    'Select * from users',
    (error,results)=>{
      res.render('index.ejs',{item : results});
    }
  );
});


app.get('/new',(req,res)=>{
  res.render('new.ejs');
});

app.post('/add',(req,res)=>{
  con.query(
    'Insert into users (firstname) values(?)',
    [req.body.Name],
    (error,results)=>{
      res.redirect('/')
    }
  );
})

app.post('/delete/:id',(req,res)=>{
  con.query(
    'DELETE from users where id=?',
    [req.params.id],
    (error,results)=>{
      res.redirect('/')
    }
  );
});

app.get('/edit/:id',(req,res)=>{
  con.query(
    'select * from users where id = ?',
    [req.params.id],
    (err,results)=>{
      console.log(results[0]);
      res.render('edit.ejs',{item:results[0]});
    }
  );
});

app.post('/update/:id',(req,res)=>{
  con.query(
    'Update users set firstname = ? where id = ?',
    [req.body.newName,req.params.id],
    (error,results)=>{
      if(error){
        console.log(error.stack)
      }
      res.redirect('/');
    }
  );
});

app.listen(3000);