const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql');
const connStr = "Server=localhost;Database=VMD;User Id=sa;Password=VMD22041748;";

sql.connect(connStr)
   .then(conn => GLOBAL.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlQry, res){
    GLOBAL.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

let str = "SET dateformat ymd; SELECT tu.cod_loja, lj.des_loja, tu.dat_movime, Sum(val_venbal) AS Val_VenBal, Sum(qtd_venbal) AS Qtd_VenBal, Sum(val_vendom) AS Val_VenDom, Sum(qtd_vendom) AS Qtd_VenDom, Sum(val_devolu) AS Val_Devolu, Sum(val_troca)  AS Val_Troca, Sum(val_descon) AS Val_Descon, Sum(val_dinfat) AS Val_DinFat, Sum(val_chvfat) AS Val_ChvFat, Sum(val_chpfat) AS Val_ChpFat, Sum(val_cmgfat) AS Val_CmgFat, Sum(val_cvnfat) AS Val_CvnFat, Sum(val_przfat) AS Val_PrzFat, Sum(val_pbmfat) AS Val_PbmFat, Sum(val_fidfat) AS Val_FidFat, Sum(val_dinest + val_dindev) AS Val_DinDev, Sum(val_chvest + val_chvdev) AS Val_ChvDev, Sum(val_chpest + val_chpdev) AS Val_ChpDev, Sum(val_cmgest + val_cmgdev) AS Val_CmgDev, Sum(val_cvnest + val_cvndev) AS Val_CvnDev, Sum(val_przest + val_przdev) AS Val_PrzDev, Sum(val_pbmest + val_pbmdev) AS Val_PbmDev, Sum(val_fidest + val_fiddev) AS Val_FidDev FROM turno tu INNER JOIN lojas lj ON tu.cod_loja = lj.cod_loja WHERE tu.dat_movime BETWEEN '2020-03-10 00:00:00' AND '2020-03-10 00:00:00' AND tu.cod_loja IN ( 1 ) GROUP BY tu.cod_loja,lj.des_loja,tu.dat_movime ORDER BY tu.cod_loja,tu.dat_movime"
router.get('/dashboard', (req, res) =>{
    execSQLQuery(str, res);
})

router.get('/produ')