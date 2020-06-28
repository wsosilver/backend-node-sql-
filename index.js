const express = require('express');
const cors = require('cors');

const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql');
const connStr = "Server=localhost;Database=VMD_Drogafor;User Id=sa;Password=VMD22041748;";

sql.connect(connStr)
   .then(conn => GLOBAL.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors());
    next();
    //console.log("acessoou o Midle")
});


//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
Now = new Date();
Mes = Now.getMonth()+1;
Ano =  Now.getFullYear();
date = Now.getFullYear() + '-' + (Now.getMonth()+1) + '-' + Now.getDate()  + ' 00:00:00';
app.listen(port);
console.log('API funcionando!');
function execSQLQuery(sqlQry, res){
    GLOBAL.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

let str = `SET dateformat ymd; SELECT tu.cod_loja, lj.des_loja, tu.dat_movime, Sum(val_venbal) AS Val_VenBal, Sum(qtd_venbal) AS Qtd_VenBal, Sum(val_vendom) AS Val_VenDom, Sum(qtd_vendom) AS Qtd_VenDom, Sum(val_devolu) AS Val_Devolu, Sum(val_troca)  AS Val_Troca, Sum(val_descon) AS Val_Descon, Sum(val_dinfat) AS Val_DinFat, Sum(val_chvfat) AS Val_ChvFat, Sum(val_chpfat) AS Val_ChpFat, Sum(val_cmgfat) AS Val_CmgFat, Sum(val_cvnfat) AS Val_CvnFat, Sum(val_przfat) AS Val_PrzFat, Sum(val_pbmfat) AS Val_PbmFat, Sum(val_fidfat) AS Val_FidFat, Sum(val_dinest + val_dindev) AS Val_DinDev, Sum(val_chvest + val_chvdev) AS Val_ChvDev, Sum(val_chpest + val_chpdev) AS Val_ChpDev, Sum(val_cmgest + val_cmgdev) AS Val_CmgDev, Sum(val_cvnest + val_cvndev) AS Val_CvnDev, Sum(val_przest + val_przdev) AS Val_PrzDev, Sum(val_pbmest + val_pbmdev) AS Val_PbmDev, Sum(val_fidest + val_fiddev) AS Val_FidDev FROM turno tu INNER JOIN lojas lj ON tu.cod_loja = lj.cod_loja WHERE tu.dat_movime BETWEEN '${date}' AND '${date}' AND tu.cod_loja IN ( 1,3,5 ) GROUP BY tu.cod_loja,lj.des_loja,tu.dat_movime ORDER BY tu.cod_loja,tu.dat_movime`
router.get('/dashboard', cors() ,(req, res) =>{
    execSQLQuery(str, res);
})


router.get('/empre', cors() ,(req, res) =>{
    execSQLQuery(dashboard, res);
})
router.get('/top_vendedores', cors() ,(req, res) =>{
    execSQLQuery(top_vendedores, res);
})
router.get('/rentabilidade', cors() ,(req, res) =>{
    execSQLQuery(rentabilidade, res);
})

router.get('/prod', cors() ,(req, res) =>{
    execSQLQuery(bus_preço, res);
})
router.get('/produ')

//Variaves=is de consulta
//data atual adicionar essa informação: ${date}


//script correto para pegar vendas do m
//let dashboard = `set dateformat ymd; Select tu.Cod_Loja,Sum(Val_VenBal) + Sum(Val_VenDom) as Val_VenBal,        Sum(Qtd_VenBal) + sum(Qtd_VenDom) as Qtd_Ven  From TURNO tu  Inner Join LOJAS lj on tu.Cod_Loja = lj.Cod_Loja  Where tu.Dat_Movime Between '${Ano}-${Mes}-01 00:00:00' and '${date}'  and   tu.Cod_Loja in (0,1,3) Group by tu.Cod_Loja, lj.Des_Loja, tu.Dat_Movime  Order by tu.Cod_Loja, Dat_Movime`;
let dashboard = `set dateformat ymd; Select tu.Cod_Loja,Sum(Val_VenBal) + Sum(Val_VenDom) as Val_VenBal,   tu.Dat_Movime as Data_Venda  ,    Sum(Qtd_VenBal) + sum(Qtd_VenDom) as Qtd_Ven  From TURNO tu  Inner Join LOJAS lj on tu.Cod_Loja = lj.Cod_Loja  Where tu.Dat_Movime Between '${Ano}-01-01 00:00:00' and '${Ano}-01-31 00:00:00'  and   tu.Cod_Loja in (0,1,3) Group by tu.Cod_Loja, lj.Des_Loja, tu.Dat_Movime  Order by tu.Cod_Loja, Dat_Movime`;
let top_vendedores = `Declare    @Data1 SmallDateTime,    @Data2 SmallDateTime  begin                       Set @Data1 = '20200101 00:00:00'   Set @Data2 = '20200131 00:00:00'    Begin try                      Drop Table #Movimento    end try begin catch end catch Create Table #Movimento( cod_movime int, cod_movven int,cod_vended int,cod_loja int,val_movime numeric(18,2),val_troca numeric(18,2),dat_emissa smalldatetime,sta_movime varchar(1),tip_entsai varchar(1),tip_operac varchar(1)) insert into #Movimento (cod_movime, cod_vended, cod_loja, val_movime, val_troca, dat_emissa, sta_movime, tip_entsai, tip_operac, cod_movven) select mc.Cod_Movime, mc.cod_vended, mc.cod_loja, mc.val_movime, mc.val_troca, mc.dat_emissa, mc.sta_movime, mc.tip_entsai, mc.tip_operac, mc.cod_movven from movcb mc where mc.Dat_Emissa between cast('20200101 00:00:00' as smalldatetime) and cast('20200131 00:00:00' as smalldatetime)  and mc.sta_movime = 'F' AND mc.cod_loja IN (1) Select mc.Cod_Vended, vd.Nom_Vended, Qtd_NotFis = Count(mc.Val_Movime),Qtd_Itens = TblItens.qtd,        Convert(Money,(Isnull(Sum(mc.Val_Movime),0)-Isnull(TblDevol.Val_Devol,0)-Isnull(Sum(mc.Val_Troca),0))) Venda_Liquida, Convert(Money,TblTotal.Total_Venda)Total_Venda, Ticket_Medio  = Round(((Isnull(Sum(mc.Val_Movime),0)-Isnull(TblDevol.Val_Devol,0)-Isnull(Sum(mc.Val_Troca),0))/(Count(mc.Val_Movime))),2), Per_Acumulado = Convert(Money,(100*(ISNULL(SUM(mc.Val_Movime),0)-ISNULL(TblDevol.Val_Devol,0)-ISNULL(SUM(mc.Val_Troca),0))/Total_Venda))   From #Movimento mc Join Vende vd on (vd.Cod_Vended = mc.Cod_Vended) Join ( Select  mc.Cod_Vended, Count(*) Qtd From #Movimento mc Join MovIt it on (mc.Cod_Loja = it.Cod_Loja and mc.Cod_Movime = it.Cod_Movime) Where (mc.Sta_Movime = 'F' and mc.Tip_EntSai = 'S' and mc.Tip_Operac = 'V') and IsNull(it.Flg_Cancel,0) = 0 Group by mc.Cod_Vended ) TblItens on (TblItens.Cod_Vended = mc.Cod_Vended) Join ( Select (Sum(Val_Movime)- Isnull(Sum(mc.Val_Troca), 0) - Isnull(TblTotalDevol.Val_Devol, 0)) Total_Venda From #Movimento mc Join ( Select Sum(ax.Val_Devol) Val_Devol From ( Select sum(Val_Movime) Val_Devol  From #Movimento mc  Where mc.Sta_Movime = 'F'   and mc.Tip_EntSai = 'E' and mc.Tip_Operac = 'D' and (mc.Cod_MovVen Is null or mc.Cod_MovVen = 0) Union Select sum(Val_Nota) Val_Devol  From _MVECB mc  Where mc.Sta_RegMve = 'F' and mc.Tip_RegMve = 'ED'  and (mc.Cod_RegSai Is null or mc.Cod_RegSai = 0) and mc.Dat_RegMve Between @Data1 and @Data2  and mc.Cod_Loja in (1) ) ax ) TblTotalDevol on (1=1) Where (mc.Sta_Movime = 'F' and mc.Tip_EntSai = 'S' and mc.Tip_Operac = 'V') and mc.Dat_Emissa Between @Data1 and @Data2  and mc.Cod_Loja in (1) Group by TblTotalDevol.Val_Devol ) TblTotal on (1=1) Left Join ( Select ax.Cod_Vended, sum(ax.Val_Devol) Val_Devol From (Select mc.Cod_Vended, sum(Val_Movime) Val_Devol From #Movimento mc Where mc.Sta_Movime = 'F' and mc.Tip_EntSai = 'E' and mc.Tip_Operac = 'D' and (mc.Cod_MovVen Is null or mc.Cod_MovVen = 0) and mc.Dat_Emissa Between @Data1 and @Data2  and mc.Cod_Loja in (1) Group by mc.Cod_Vended UNION Select mc.Cod_Vended, sum(Val_Nota) Val_Devol From _MVECB mc Where mc.Sta_RegMve = 'F' and mc.Tip_RegMve = 'ED' and (mc.Cod_RegSai Is null or mc.Cod_RegSai = 0) and mc.Dat_RegMve Between @Data1 and @Data2  and mc.Cod_Loja in (1) Group by mc.Cod_Vended) ax Group By ax.Cod_Vended) TblDevol on (mc.Cod_Vended = TblDevol.Cod_Vended)   Where (mc.Sta_Movime = 'F' and mc.Tip_EntSai = 'S' and mc.Tip_Operac = 'V')   and mc.Dat_Emissa Between @Data1 and @Data2   and (mc.Cod_MovVen Is null or mc.Cod_MovVen = 0)  and mc.Cod_Loja in (1)   Group by mc.Cod_Vended, vd.Nom_Vended, TblDevol.Val_Devol, TblTotal.Total_Venda, TblItens.Qtd   Order by Venda_Liquida desc end`;
let rentabilidade = `set dateformat ymd;Select TblAux.Cod_GrpPrc, TblAux.Des_GrpPrc, Sum(TblAux.Qtd) Qtd, Sum(TblAux.Valor) Valor From ( ( Select pd.Cod_GrpPrc, gp.Des_GrpPrc, Sum(mi.Qtd_produt) Qtd, Sum(mi.Val_liqite) Valor From MovCb mc Join MovIt mi on (mc.Cod_Loja = mi.Cod_Loja and mc.Cod_Movime = mi.Cod_Movime) Join Produ pd on (mi.Cod_Produt = pd.Cod_Produt) Join GrPrc gp on (gp.Cod_GrpPrc = pd.Cod_GrpPrc) Join Fabri fa on (pd.Cod_Fabric = fa.Cod_Fabric) Join Lojas On mc.Cod_Loja = Lojas.Cod_Loja Where (mc.Sta_Movime = 'F' and mc.Tip_EntSai = 'S' and mc.Tip_Operac = 'V')  and mi.Flg_Cancel = 0  and mc.Dat_Emissa between '2020-02-01 00:00:00' and '2020-03-31 00:00:00' and mc.Cod_Loja in (1)  Group by pd.Cod_GrpPrc, gp.Des_GrpPrc ) Union ( Select pd.Cod_GrpPrc, gp.Des_GrpPrc, -Sum(mi.Qtd_Produt) Qtd, -Sum(mi.Qtd_Produt*mi.Prc_Unitar) Valor From MOVCB mc Join MOVIT mi on (mc.Cod_Loja = mi.Cod_Loja and mc.Cod_Movime = mi.Cod_Movime) Join Produ pd on (mi.Cod_Produt = pd.Cod_Produt) Join GrPrc gp on (gp.Cod_GrpPrc = pd.Cod_GrpPrc) Join Fabri fa on (pd.Cod_Fabric = fa.Cod_Fabric) Join Lojas On mc.Cod_Loja = Lojas.Cod_Loja Where (mc.Sta_Movime = 'F' and mc.Tip_EntSai = 'E' and mc.Tip_Operac = 'D')  and mi.Flg_Cancel = 0  and mc.Dat_Emissa between '2020-01-01 00:00:00' and '2020-01-31 00:00:00' and mc.Cod_Loja in (1)  Group by pd.Cod_GrpPrc, gp.Des_GrpPrc ) Union ( Select pd.Cod_GrpPrc, gp.Des_GrpPrc, -Sum(mi.Qtd_Produt) Qtd, -Sum(mi.Qtd_Produt*mi.Prc_Unitar) Valor From _MveCb mc Join _MveIt mi on (mc.Cod_Loja = mi.Cod_Loja and mc.Cod_RegMve = mi.Cod_RegMve) Join Produ pd on (mi.Cod_Produt = pd.Cod_Produt) Join GrPrc gp on (gp.Cod_GrpPrc = pd.Cod_GrpPrc) Join Fabri fa on (pd.Cod_Fabric = fa.Cod_Fabric) Join Lojas On mc.Cod_Loja = Lojas.Cod_Loja Where mc.Sta_RegMve = 'F' and mc.Tip_RegMve = 'ED' and mc.Dat_RegMve between '2020-01-01 00:00:00' and '2020-01-31 00:00:00' and mc.Cod_Loja in (1)  Group by pd.Cod_GrpPrc, gp.Des_GrpPrc ) ) TblAux Group by TblAux.Cod_GrpPrc, TblAux.Des_GrpPrc Order by Valor Desc`;
let bus_preço = `select b.Des_Produt,a.Prc_VenAtu from prxlj a inner join PRODU b on a.Cod_Produt = b.Cod_Produt where a.Cod_Produt = 916331 and a.Cod_Loja = 1`