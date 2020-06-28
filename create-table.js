
const connStr = "Server=localhost;Database=VMD_Drogafor;User Id=sa;Password=VMD22041748;";
const sql = require("mssql");

sql.connect(connStr)
    .then(conn => console.log("conectou"))
    .catch(err => console.log("erro" + err))



