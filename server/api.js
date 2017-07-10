import Promise from 'bluebird';
import evangelizo from 'evangelizo';
import _ from 'lodash';
import moment from 'moment';
import settings from 'settings';

import { getConnection } from '@/config/mongodb';
import logger from '@/config/logger';

var api = {};

function updateReading(db, readingDoc) {
  logger.debug("Updating...");
  let promise = new Promise((resolve, reject) => {
    db.collection('readings').updateOne({
      _id: readingDoc._id
    }, {
      $set: { content: readingDoc.content }
    }, (err, r) => {
      if (err) {
        logger.debug("Error: ", err);
        reject(err);
      }
      logger.debug("Updated reading document", readingDoc);
      resolve(r);
    });
  });
  return promise;
}

function checkOpts(opts) {
  var currentDay = parseInt(moment().utcOffset(settings.utcOffset).format('YYYYMMDD'));
  // currentDay.setHours(0,0,0,0);
  logger.debug("Current time: ", currentDay);
  if (typeof opts === 'undefined') {
    opts = {
      date: currentDay,
      lang: 'AM'
    };
    return opts;
  }
  if (typeof opts.date === 'undefined') { opts.date = currentDay; }
  else { opts.date = parseInt(moment(opts.date, 'YYYYMMDD').format('YYYYMMDD')); }
  if (typeof opts.lang === 'undefined') { opts.lang = 'AM'; }
  return opts;
}

api.getLiturgy = function(liturgyOpts) {
  liturgyOpts = checkOpts(liturgyOpts);
  logger.debug("Set options: ", liturgyOpts);
  let promise = new Promise((resolve, reject) => {
    getConnection().then((db) => {
      // Look for the document in database
      db.collection('readings').find({
        readingDate: liturgyOpts.date,
        lang: liturgyOpts.lang,
      }).toArray((err, result) => {
        if (err) reject(err);
        if (_.size(result) > 0) {
          // If we found it, return it
          resolve(result[0]);
        } else {
          // If not, fetch it from API and insert to database
          // First create the new doc for new Liturgy entry in this date and lang
          let readingDoc = {
            readingDate: liturgyOpts.date,
            lang: liturgyOpts.lang,
            content: {
              fr: {},
              ps: {},
              sr: {},
              gsp: {}
            }
          };
          db.collection('readings').insertOne(readingDoc, (insertErr, r) => {
            // Reject promise if insert error
            if (insertErr) reject(insertErr);

            logger.debug("Inserted new document", readingDoc);

            // Now fetch each part of the liturgic content and update the inserted document
            // Keep a count of the completed operations
            let counter = 0;

            // Liturgic Title
            evangelizo.getLiturgicTitle(liturgyOpts).then((str) => {

              // Update reading document
              readingDoc.content.liturgicTitle = str;
              logger.debug("Got liturgicTitle");

              // Increment counter of completed tasks
              counter++;

              // Check if all operations are complete
              if (counter === 15) {

                // If so, update reading doc
                updateReading(db, readingDoc).then((r) => {

                  // Finally, return the object
                  resolve(readingDoc);
                }, (updateErr) => {

                  // Return the error
                  reject(updateErr);
                });
              }
            }, (evangelizoError) => {

              // Return EvangelizoError
              reject(evangelizoError);
            });

            // Feast
            evangelizo.getFeast(liturgyOpts).then((str) => {
              readingDoc.content.feast = str;
              logger.debug("Got feast");

              counter++;

              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoError) => {
              reject(evangelizoError);
            });

            // Saint
            evangelizo.getSaint(liturgyOpts).then((str) => {
              readingDoc.content.saint = str;
              logger.debug("Got saint");

              counter++;

              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoError) => {
              reject(evangelizoError);
            });

            // First Reading
            evangelizo.getReading('FR', liturgyOpts).then((str) => {
              readingDoc.content.fr.text = str;
              logger.debug("Got fr");

              counter++;

              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // First reading long title
            evangelizo.getReadingLt('FR', liturgyOpts).then((str) => {
              readingDoc.content.fr.lt = str;
              logger.debug("Got fr");

              counter++;

              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // First reading short title
            evangelizo.getReadingSt('FR', liturgyOpts).then((str) => {
              readingDoc.content.fr.st = str;
              logger.debug("Got fr");

              counter++;

              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Psalm
            evangelizo.getReading('PS', liturgyOpts).then((str) => {
              readingDoc.content.ps.text = str;
              logger.debug("Got psalm");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Psalm long title
            evangelizo.getReadingLt('PS', liturgyOpts).then((str) => {
              readingDoc.content.ps.lt = str;
              logger.debug("Got psalm");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Psalm short title
            evangelizo.getReadingSt('PS', liturgyOpts).then((str) => {
              readingDoc.content.ps.st = str;
              logger.debug("Got psalm st");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Second Reading
            evangelizo.getReading('SR', liturgyOpts).then((str) => {
              readingDoc.content.sr.text = str;
              logger.debug("Got sr");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Second Reading long title
            evangelizo.getReadingLt('SR', liturgyOpts).then((str) => {
              readingDoc.content.sr.lt = str;
              logger.debug("Got sr st");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Second Reading short title
            evangelizo.getReadingSt('SR', liturgyOpts).then((str) => {
              readingDoc.content.sr.st = str;
              logger.debug("Got sr st");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Gospel
            evangelizo.getReading('GSP', liturgyOpts).then((str) => {
              readingDoc.content.gsp.text = str;
              logger.debug("Got gospel");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Gospel long title
            evangelizo.getReadingLt('GSP', liturgyOpts).then((str) => {
              readingDoc.content.gsp.lt = str;
              logger.debug("Got gospel lt");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

            // Gospel short title
            evangelizo.getReadingSt('GSP', liturgyOpts).then((str) => {
              readingDoc.content.gsp.st = str;
              logger.debug("Got gospel st");
              counter++;
              if (counter === 15) {
                updateReading(db, readingDoc).then((r) => {
                  resolve(readingDoc);
                }, (updateErr) => {
                  reject(updateErr);
                });
              }
            }, (evangelizoErr) => {
              reject(evangelizoErr);
            });

          });
        }
      });
    }, (dbErr) => {
      reject(dbErr);
    });
  });

  return promise;
};

module.exports = api;
