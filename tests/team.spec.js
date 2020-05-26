import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';

global.XMLHttpRequest = XMLHttpRequest

describe('Team resolver ',()=>{

    /**** ****************************        Query                                     *********************/









    /**** ****************************        Mutation                                     *********************/


    // start : create team


    test("create_team", async () => {


        const response = await axios.post('http://localhost:8081/graphql', {

            query: `
            
            mutation {

                login(email:"testuser@testuser.com",password:"tester") {
                    token
                    refreshToken 

                }

            }
  
            
            
            `
        });

        const {data:{login:{token,refreshToken}}}= response.data;



        const response2 = await axios.post(
            'http://localhost:8081/graphql',
            {
              query: `
            mutation {
              createTeam(name: "team1") {
                ok
                team {
                  name
                }
              }
            }
            `,
            },
            {
              headers: {
                'x-token': token,
                'x-refresh-token': refreshToken,
              },
            },
          );
       



    });




    expect(response2.data).toMatchObject({
      data: {
        createTeam: {
          ok: true,
          team: {
            name: 'team1',
          },
        },
      },
    });
  });





    // END : create team







    

