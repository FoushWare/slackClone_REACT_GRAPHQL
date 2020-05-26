import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';

global.XMLHttpRequest = XMLHttpRequest;


describe('user resolver ', () => {




    /**** ****************************        Query                                     *********************/

    // GET ALLUSERS in the testslack DB  when the DB is empty 
    test('allUsers', async () => {

        const response = await axios.post('http://localhost:8081/graphql', {
            query: `
            
                query{

                    allUsers {
                        id
                        username
                        email
                    }
                }
            
            `
        });

        const { data } = response;

        expect(data).toMatchObject({
            data: {
                allUsers: [],
            }
        });


    });



    /**** ****************************        Mutations                                      *********************/




    //start Reigster user 

    test('register_user', async()=>{
        const response = await axios.post("http://localhost:8081/graphql",{
            query: `
                mutation{
                    register(username:"testuser",email:"testuser@testuser.com",password:"tester"){
                        ok
                        errors {
                            path
                            message
                        }
                        user {
                            username
                            email
                        }
                    }
                }
            
            `
        });

        const {data} = response;
        expect(data).toMatchObject({
            data:{
                register:{
                    ok:true,
                    errors: null,
                    user:{
                        username:'testuser',
                        email: 'testuser@testuser.com'
                    }
                }
            }
        });
    });

    // end user register





    test("user_login", async () => {


        const response2 = await axios.post('http://localhost:8081/graphql', {

            query: `
            
            mutation {

                login(email:"testuser@testuser.com",password:"tester") {
                    token
                    refreshToken 

                }

            }
  
            
            
            `
        });

        const {data:{login:{token,refreshToken}}}= response2.data;

       



    });















    /**** ****************************        Subscriptions                                      *********************/



















});