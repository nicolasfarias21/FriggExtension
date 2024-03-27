import { db } from "../db.js";

export const getUsers = (_, res) => {
  const q = `
  SELECT r.*, 
  c.Nome AS NomeCoordenadoria, 
  u.Sigla AS NomeUnidade, 
  cg.Nome AS NomeCargo
FROM Ramal r 
JOIN Coordenadoria c ON r.IdCoordenadoria = c.IdCoordenadoria
JOIN Unidade u ON r.IdUnidade = u.IdUnidade
JOIN Cargo cg ON r.IdCargo = cg.IdCargo
WHERE r.Status = 1;
 `;

  db.query(q, (err, data) => {
    if(err) return res.json(err);

    return res.status(200).json(data);
  });  
};

