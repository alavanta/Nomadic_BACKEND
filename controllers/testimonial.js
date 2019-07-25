require('dotenv').config();

const response = require('../responses/response');
const connection = require('../config/connect');
const redis = require('redis');
const client = redis.createClient('redis://h:p7650c21ee2e8e3c0b3a10a95d3645b3111a525b03800b46ebb237f3bdb06b289@ec2-3-222-186-102.compute-1.amazonaws.com:31529');

exports.showTestimonial = (req, res) => {
  let query = 'SELECT * FROM testimonial';

  let regisKey = 'packages:rows'

  return client.get(regisKey, (err, rows) => {
    console.log(regisKey);

    if (rows) {
      res.send({
        data: JSON.parse(rows)
      })
      client.del(regisKey);
    } else {
      connection.query(query, (error, rows, field) => {
        if (error) {
          res.status(400), console.log(error);
        } else {
          if (rows != '') {
            client.setex(regisKey, 3600, JSON.stringify(rows));
            res.status(200).send({
              data: rows
            });
          } else {
            res.status(404).json({
              status: 404,
              data: 'Data not found !'
            });
          }
        }
      });
    }
  });
};

exports.deleteTestimonial = (req,res) => {
    let id = req.params.id;
    let query = `DELETE FROM testimonial WHERE id = ${id}`;

    connection.query(query,(err,rows,field) => {
        if(err) {
            res.status(401).json({
                message : err
            })
        }else {
            if(rows.affectedRows != 0 || rows.affectedRows != "") {
                res.status(200).json({
                    status : 200,
                    data : rows
                })
            }else {
                res.status(404).json({
                    status : 404,
                    message : 'Data not found, please check again your id !'
                })
            }
        }
    })
}

exports.createTestimonial = (req,res) => {
    let {name,image,title,caption} = req.body;
    let query = `INSERT INTO testimonial SET name = '${name}', image_url= '${image}', title = '${title}', caption = '${caption}'`;
    console.log('masuk ke create')
    connection.query(query,(err,rows,field)=>{
        
        console.log(query)
        if(rows != "") {
            connection.query(`SELECT *  FROM testimonial ORDER BY id DESC LIMIT 1`,(err,row,field)=>{
                if(err){
                    console.log(err)
                }else {
                    res.status(201).send({
                        status : 201,
                        data : row
                    })
                }
            })
        }else {
            res.status(404).send({
                status : 404,
                message : 'Data not found, please check your ID again '
            })
        }
    })
}