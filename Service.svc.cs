using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;

namespace eBay.Service
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Service : IService
    {
        private SqlConnection CreateConnection()
        {
            string ConnStr = ConfigurationManager.ConnectionStrings["ConnectionStringName"].ConnectionString;
            return new SqlConnection(ConnStr);
        }

        public string GetData(int value)
        {
            return string.Format("You entered: {0}", value);
        }

        public string[] GetUser(string Id)
        {
            return new User().GetUser(Convert.ToInt32(Id));
        }

        /// <summary>
        /// Select in line script
        /// </summary>
        /// <returns></returns>
        public List<Models.Person> GetPersons()
        {
            List<Models.Person> matchingPerson = new List<Models.Person>();
            using (SqlConnection myConnection = CreateConnection())
            {
                string oString = "Select * from [AdventureWorks2014].[Person].[Person]";
                SqlCommand oCmd = new SqlCommand(oString, myConnection);
                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        Models.Person person = new Models.Person();
                        person.FirstName = oReader["FirstName"].ToString();
                        person.MiddleName = oReader["MiddleName"].ToString();
                        person.LastName = oReader["LastName"].ToString();

                        matchingPerson.Add(person);
                    }

                    myConnection.Close();
                }
            }

            return matchingPerson;

        }

        /// <summary>
        /// Stored procedure
        /// </summary>
        /// <returns></returns>
        public List<Models.Person> GetPersonsSP()
        {
            List<Models.Person> matchingPerson = new List<Models.Person>();
            using (SqlConnection myConnection = CreateConnection())
            {
                SqlCommand oCmd = new SqlCommand("GetPersons", myConnection);
                oCmd.CommandType = CommandType.StoredProcedure;

                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        Models.Person person = new Models.Person();
                        person.FirstName = oReader["FirstName"].ToString();
                        person.MiddleName = oReader["MiddleName"].ToString();
                        person.LastName = oReader["LastName"].ToString();

                        matchingPerson.Add(person);
                    }

                    myConnection.Close();
                }
            }

            return matchingPerson;

        }

        /// <summary>
        /// Stored procedure with value
        /// </summary>
        /// <returns></returns>
        public List<Models.Person> GetPersonsSPByValue(string value)
        {
            List<Models.Person> matchingPerson = new List<Models.Person>();
            using (SqlConnection myConnection = CreateConnection())
            {
                SqlCommand oCmd = new SqlCommand("GetPersonsByValue", myConnection);
                oCmd.CommandType = CommandType.StoredProcedure;


                // Add the input parameter and set its properties.
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = "@MiddleName";
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.Direction = ParameterDirection.Input;
                parameter.Value = value;

                // Add the parameter to the Parameters collection. 
                oCmd.Parameters.Add(parameter);

                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        Models.Person person = new Models.Person();
                        person.FirstName = oReader["FirstName"].ToString();
                        person.MiddleName = oReader["MiddleName"].ToString();
                        person.LastName = oReader["LastName"].ToString();

                        matchingPerson.Add(person);
                    }

                    myConnection.Close();
                }
            }

            return matchingPerson;

        }

        /// <summary>
        /// Select in line script with value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public List<Models.Person> GetPersonsByValue(string value)
        {
            List<Models.Person> matchingPerson = new List<Models.Person>();
            using (SqlConnection myConnection = CreateConnection())
            {
                string oString = "Select * from [AdventureWorks2014].[Person].[Person] where MiddleName Like @middleName";
                SqlCommand oCmd = new SqlCommand(oString, myConnection);
                oCmd.Parameters.AddWithValue("@middleName", value);
                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        Models.Person person = new Models.Person();
                        person.FirstName = oReader["FirstName"].ToString();
                        person.MiddleName = oReader["MiddleName"].ToString();
                        person.LastName = oReader["LastName"].ToString();

                        matchingPerson.Add(person);
                    }

                    myConnection.Close();
                }
            }

            return matchingPerson;
        }

        public int AddPerson(Models.Person person)
        {
            int retVal;
            using (SqlConnection myConnection = CreateConnection())
            {
                string oString = "INSERT INTO [AdventureWorks2014].[Person].[ContactType] VALUES (@name, @modifiedDate)";
                SqlCommand oCmd = new SqlCommand(oString, myConnection);
                oCmd.Parameters.AddWithValue("@name", person.FirstName);
                oCmd.Parameters.AddWithValue("@modifiedDate", DateTime.Now);

                myConnection.Open();
                retVal = oCmd.ExecuteNonQuery();
                myConnection.Close();
            }

            return retVal;
        }
    }

    public class User
    {

        Dictionary<int, string> users = null;
        public User()
        {
            users = new Dictionary<int, string>();
            users.Add(1, "pranay");
            users.Add(2, "Krunal");
            users.Add(3, "Aditya");
            users.Add(4, "Samir");
        }

        public string[] GetUser(int Id)
        {
            var user = from u in users
                       where u.Key == Id
                       select u.Value;

            return user.ToArray<string>();
        }

    }
}
