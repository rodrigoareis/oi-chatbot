// This module is designed as an auxiliary module
// to load the data that are used by application
/* eslint no-unused-vars: "off" */

var Database = (function() {

  var nano = null;

  // Publicly accessible methods defined
  return {
    initialize: initializeDatabase,
    getPlanOptions: getPlanOptionsByType
  };

  // Initialize the module
  function initializeDatabase(_nano) {
    nano = _nano;

    if(nano) {
      getDatabase();  
    } else {
      console.log('Could not estabilish a connection. Please check env settings for Cloudant database.');
    }

  }

  // check if database already exist. If not, create new database
  function getDatabase() {    
    nano.db.get( 'plan_types', function(err) {
      if ( err ) {
        console.log('Database does not exist.');
        createDatabase(function(errCreate) {
          console.error(errCreate);
        } );
      } else {
        console.log('Database connected.');
      }
    } );
  }

  function createDatabase() {
    console.log('creating database...');
    // clean up any plan types database created previously
    nano.db.destroy('plan_types', function() {
      // create a new database
      nano.db.create('plan_types', function() {
        // specify the database to use
        var plan_types = nano.use('plan_types');
        // create plan types documents in it        
        plan_types.bulk({ docs: [
            { 
              'type_id' : 'pos', 
              'title':  'Pós-Pago' ,
              'description': "Planos mensais a partir de R$74,90 com 3 GB de Internet 4G e 500 minutos.",
              'payment': 'Fatura'  
            },
            {
              'type_id' : 'controle',
              'title':  'Controle' ,
              'description': "Planos mensais a partir de R$34,90 com 1,5 GB de Internet 4G e minutos Ilimitados para Oi.",
              'payment': 'Cartão de Crédito'
            },
            {
              'type_id' : 'pre',
              'title':  'Pré-Pago' ,
              'description': "Planos a partir de R$0,99 por dia." ,
              'payment': 'Recarga'
            },
          ]}, function(err, body, header) {
          if (err) {
            console.log('Error creating documents - ', err.message);
            return;
          } else {
            console.log('plan types records inserted.');
          }
        });
      });
    });    
    // clean up any plan_options database created previously
    nano.db.destroy('plan_options', function() {
      // create a new database
      nano.db.create('plan_options', function() {
        // specify the database to use
        var plan_options = nano.use('plan_options');    
        // create plan options documents in it
        plan_options.bulk({ docs: [
            { 
              'type_id': 'pos',
              'title':  'Top' ,
              'price': "219,90",
              'minutes': '3.000',
              'internet': "10 GB"  
            },
            {
              'type_id': 'pos',
              'title':  'Avançado' ,
              'price': "169,90",
              'minutes': '1.000',
              'internet': "10 GB"  
            },
            {
              'type_id': 'pos',
              'title':  'Intermediário' ,
              'price': "99,90",
              'minutes': '1.000',
              'internet': "5 GB" 
            },
            {
              'type_id': 'pos',
              'title':  'Básico' ,
              'price': "74,90",
              'minutes': '500',
              'internet': "3 GB" 
            }, 
            {
              'type_id': 'controle',
              'title':  'Avançado' ,
              'price': "59,90",
              'minutes': '500',
              'internet': "2,5 GB"  
            },
            {
              'type_id': 'controle',
              'title':  'Intermediário' ,
              'price': "44,90",
              'minutes': '250',
              'internet': "2 GB" 
            },
            {
              'type_id': 'controle',
              'title':  'Básico' ,
              'price': "44,90",
              'minutes': '0',
              'internet': "1,5 GB" 
            },   
            {
              'type_id': 'pre',
              'title':  'Por mês' ,
              'price': "40,00",
              'minutes': '500',
              'internet': "1,5 GB"  
            },
            {
              'type_id': 'pre',
              'title':  'Por semana' ,
              'price': "10,00",
              'minutes': '100',
              'internet': "500 MB" 
            },
            {
              'type_id': 'pre',
              'title':  'Por minuto' ,
              'price': "0,99",
              'minutes': '0',
              'internet': "60 MB" 
            },              
          ]}, function(err, body, header) {
          if (err) {
            console.log('Error creating documents - ', err.message);
            return;
          }else{
            console.log('plan options records inserted.');
          }
        });
        // create by_type view
        plan_options.insert({
            "views": {
               "by_type": {
                  "map": function (doc) {
                     emit([doc.type_id], doc);
                  }
               }
            }
         }, '_design/by_type', function (err, response) {
          if (err) {
            console.log('Error creating view - ', err.message);
            return;
          }else{
            console.log("by_type view created.");
            console.log('Database successfully created.');
          }
         });
      });
    });
  }

  function getPlanOptionsByType(key, result) {
    if(nano) {
      var plan_options = nano.use('plan_options'); 
      plan_options.view('by_type', 'by_type', {key: [key], include_docs: true }, function(err, body) {
        if (!err) {
          var values = [];
          body.rows.forEach(function(doc) {
            values.push(doc.value);
          });
          result(values);
        } else {
          console.log('Error getting plan options data - ', err.message);
        }
      });
    }  
  }

}());

if(typeof module !== "undefined")
  module.exports = Database;
