const db = require("../config/db");

const create = (body) => {
  return new Promise((resolve, reject) => {
    const {
      mother_name,
      mother_age,
      genderBaby_id,
      baby_weight,
      baby_long,
      gestational_age,
      date,
      parturition_id,
      condition_id,
    } = body;
    const queryCheckMotherData = "select * from mothers where name = $1";
    const queryInsertMother =
      'insert into mothers("name",age) values ($1,$2) returning id';
    const queryInsertBaby =
      "insert into babys(gender_id,weight,long) values ($1,$2,$3) returning id";
    const queryPivot =
      "insert into mothers_babys(mother_id,baby_id,gestational_age,date,parturition_id,condition_id) values($1,$2,$3,$4,$5,$6)";
    db.connect((_, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error("Error in create data", err.stack);
          reject({ statusCode: 400, msg: "Internal Server Error" });
          client.query("ROLLBACK", (err) => {
            if (err) {
              console.log(err.stack);
              reject({ statusCode: 400, msg: "Internal Server Error" });
            }
            done();
          });
        }
        return !!err;
      };
      client.query("BEGIN", (err) => {
        if (shouldAbort(err)) return;
        const insertBaby = (id) => {
          client.query(
            queryInsertBaby,
            [genderBaby_id, baby_weight, baby_long],
            (err, resultBaby) => {
              if (shouldAbort(err)) return;
              const baby_id = resultBaby.rows[0].id;
              client.query(
                queryPivot,
                [
                  id,
                  baby_id,
                  gestational_age,
                  date,
                  parturition_id,
                  condition_id,
                ],
                (err, _) => {
                  if (shouldAbort(err)) return;
                  client.query("COMMIT", (err) => {
                    if (shouldAbort(err)) return;
                    resolve({ statusCode: 200, msg: "data created!" });
                  });
                }
              );
            }
          );
        };
        client.query(
          queryCheckMotherData,
          [mother_name],
          (err, resultCheckMother) => {
            if (shouldAbort(err)) return;
            if (resultCheckMother.rowCount !== 0) {
              const mother_id = resultCheckMother.rows[0].id;
              if (
                resultCheckMother.rows[0].age !== mother_age &&
                resultCheckMother.rows[0].age <= mother_age
              ) {
                const queryUpdateAge =
                  "update mothers set age = $1,update_at = now() where id = $2";
                client.query(
                  queryUpdateAge,
                  [mother_age, mother_id],
                  (err, _) => {
                    if (shouldAbort(err)) return;
                    insertBaby(mother_id);
                  }
                );
              } else {
                insertBaby(mother_id);
              }
            } else {
              client.query(
                queryInsertMother,
                [mother_name, mother_age],
                (err, resultMother) => {
                  if (shouldAbort(err)) return;
                  const mother_id = resultMother.rows[0].id;
                  insertBaby(mother_id);
                }
              );
            }
          }
        );
      });
    });
  });
};

const get = (queryParams) => {
  return new Promise((resolve, reject) => {
    const {
      day,
      month,
      year,
      condition_baby,
      gender_baby,
      age_mother,
      parturition,
      limit,
      page,
    } = queryParams;
    let link = ``;
    let queryLimit = `;`;
    let querySearch = `select m.id, m."name", m.age, g."name" as gender_baby, b.weight, b.long, mb.gestational_age, p."name" as parturition, c.status, TO_CHAR(mb."date", 'DD/MM/YYYY hh:mi:ss') as date from mothers_babys mb left join mothers m on mb.mother_id = m.id join babys b on mb.baby_id = b.id join gender g on b.gender_id = g.id join "condition" c on mb.condition_id = c.id join parturition p on mb.parturition_id = p.id`;
    if (day) {
      querySearch += ` WHERE EXTRACT(DAY FROM mb."date") = ${day}`;
      link += `day=${day}&`;
    }
    if (month) {
      if (day) {
        querySearch += ` and EXTRACT(MONTH FROM mb."date") = ${month}`;
        link += `month=${month}&`;
      } else {
        querySearch += ` WHERE EXTRACT(MONTH FROM mb."date") = ${month}`;
        link += `month=${month}&`;
      }
    }
    if (year) {
      if (day || month) {
        querySearch += ` and EXTRACT(YEAR FROM mb."date") = ${year}`;
        link += `year=${year}&`;
      } else {
        querySearch += ` WHERE EXTRACT(YEAR FROM mb."date") = ${year}`;
        link += `year=${year}&`;
      }
    }
    if (condition_baby) {
      if (day || month || year) {
        querySearch += ` and mb.condition_id = ${condition_baby}`;
        link += `condition_baby=${condition_baby}&`;
      } else {
        querySearch += ` WHERE mb.condition_id = ${condition_baby}`;
        link += `condition_baby=${condition_baby}&`;
      }
    }
    if (gender_baby) {
      if (day || month || year) {
        querySearch += ` and b.gender_id = ${gender_baby}`;
        link += `gender_baby=${gender_baby}&`;
      } else {
        querySearch += ` WHERE b.gender_id = ${gender_baby}`;
        link += `gender_baby=${gender_baby}&`;
      }
    }
    if (age_mother) {
      if (day || month || year) {
        querySearch += ` and m.age = ${age_mother}`;
        link += `age_mother=${age_mother}&`;
      } else {
        querySearch += ` WHERE m.age = ${age_mother}`;
        link += `age_mother=${age_mother}&`;
      }
    }
    if (parturition) {
      if (day || month || year) {
        querySearch += ` and mb.parturition_id = ${parturition}`;
        link += `parturition=${parturition}&`;
      } else {
        querySearch += ` WHERE mb.parturition_id = ${parturition}`;
        link += `parturition=${parturition}&`;
      }
    }
    let values = [];
    if (page && limit) {
      let offset = (parseInt(page) - 1) * parseInt(limit);
      queryLimit = querySearch + ` limit $1 offset $2`;
      values.push(limit, offset);
    }
    db.query(querySearch, (err, getData) => {
      if (err) {
        console.log(err.message);
        return reject({ statusCode: 400, msg: "Internal Server Error" });
      }
      db.query(queryLimit, values, (err, result) => {
        if (err) {
          console.log(err.message);
          return reject({ statusCode: 400, msg: "Internal Server Error" });
        }
        if (result.rowCount === 0) {
          return resolve({ statusCode: 404, msg: "data not found!" });
        }
        let start = (parseInt(page) - 1) * parseInt(limit);
        let end = parseInt(page) * parseInt(limit);
        let next = "";
        let prev = "";
        let resNext = null;
        let resPrev = null;
        const dataNext = Math.ceil(getData.rowCount / parseInt(limit));
        if (start <= getData.rowCount) {
          next = parseInt(page) + 1;
        }
        if (end > 0) {
          prev = parseInt(page) - 1;
        }
        if (parseInt(next) <= parseInt(dataNext)) {
          resNext = `${link}page=${next}&limit=${limit}`;
        }
        if (parseInt(prev) !== 0) {
          resPrev = `${link}page=${prev}&limit=${limit}`;
        }

        resolve({
          statusCode: 200,
          totalData: getData.rowCount,
          totalPage: Math.ceil(getData.rowCount / limit),
          next: resNext,
          prev: resPrev,
          data: result.rows,
        });
      });
    });
  });
};

const getDashboard = (queryParams) => {
  return new Promise((resolve, reject) => {
    const querySelectData = `select m.id, m."name", m.age, g."name" as gender_baby, b.weight, b.long, mb.gestational_age, p."name" as parturition, c.status, TO_CHAR(mb."date", 'DD/MM/YYYY hh:mi:ss') from mothers_babys mb left join mothers m on mb.mother_id = m.id join babys b on mb.baby_id = b.id join gender g on b.gender_id = g.id join "condition" c on mb.condition_id = c.id join parturition p on mb.parturition_id = p.id WHERE EXTRACT(YEAR FROM mb."date") = $1`;
    db.query(querySelectData, [queryParams.year], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject({ statusCode: 400, msg: "Internal Server Error" });
      }
      if (result.rowCount === 0) {
        return resolve({ statusCode: 404, msg: "data not found!" });
      }
      let GestationalAge = 0;
      let conditionHealthy = 0;
      let conditionDisabilities = 0;
      let conditionDead = 0;
      let Male = 0;
      let Female = 0;
      let Months = [
        {
          name: "Jan",
          total: 0,
        },
        {
          name: "Feb",
          total: 0,
        },
        {
          name: "Mar",
          total: 0,
        },
        {
          name: "April",
          total: 0,
        },
        {
          name: "Mei",
          total: 0,
        },
        {
          name: "Juni",
          total: 0,
        },
        {
          name: "Juli",
          total: 0,
        },
        {
          name: "Agust",
          total: 0,
        },
        {
          name: "Sep",
          total: 0,
        },
        {
          name: "Okt",
          total: 0,
        },
        {
          name: "Nov",
          total: 0,
        },
        {
          name: "Des",
          total: 0,
        },
      ];
      result.rows.forEach((data) => {
        GestationalAge += data.gestational_age;
        if (data.status === "Healthy") conditionHealthy += 1;
        if (data.status === "Disabilities") conditionDisabilities += 1;
        if (data.status === "Dead") conditionDead += 1;
        let getMonth = "";
        if (data.to_char.split(" ")[0].split("/")[1].split("")[0] === "0") {
          getMonth = data.to_char.split(" ")[0].split("/")[1].split("")[1];
        } else {
          getMonth = data.to_char.split(" ")[0].split("/")[1];
        }
        if (data.gender_baby === "Perempuan") {
          Female += 1;
        } else {
          Male += 1;
        }
        Months.forEach((listMonth) => {
          let tempMonth = "";
          if (getMonth === "1") tempMonth = "Jan";
          if (getMonth === "2") tempMonth = "Feb";
          if (getMonth === "3") tempMonth = "Mar";
          if (getMonth === "4") tempMonth = "April";
          if (getMonth === "5") tempMonth = "Mei";
          if (getMonth === "6") tempMonth = "Juni";
          if (getMonth === "7") tempMonth = "Juli";
          if (getMonth === "8") tempMonth = "Agust";
          if (getMonth === "9") tempMonth = "Sep";
          if (getMonth === "10") tempMonth = "Okt";
          if (getMonth === "11") tempMonth = "Nov";
          if (getMonth === "12") tempMonth = "Des";
          if (listMonth.name === tempMonth) {
            listMonth.total += 1;
          }
        });
      });
      const TotalBaby = result.rowCount;
      const avgGestationalAge = GestationalAge / result.rowCount;
      const Dashboard = {
        TotalBaby,
        Male,
        Female,
        conditionHealthy,
        conditionDisabilities,
        conditionDead,
        avgGestationalAge,
        Months,
      };
      resolve({ statusCode: 200, Dashboard });
    });
  });
};

const dataRepo = {
  create,
  get,
  getDashboard,
};

module.exports = dataRepo;
