const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { addMocksToSchema } = require('@graphql-tools/mock');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = require('./schema');
//Array Todo
const tasks = [
  {
    userId: 1,
    id: '0',
    title: "Task 1 ",
    completed: false
  },
  {
    userId: 1,
    id: '1',
    title: "Task 2",
    completed: false
  },
  {
    userId: 1,
    id: '2',
    title: "Task 3",
    completed: false
  },
  {
    userId: 1,
    id: '3',
    title: "Task 4",
    completed: false
  },
  {
    userId: 1,
    id: '4',
    title: "Task 5",
    completed: false
  },
  {
    userId: 1,
    id: '5',
    title: "Task 6",
    completed: false
  },
  {
    userId: 1,
    id: '6',
    title: "Task 7",
    completed: false
  },
  {
    userId: 1,
    id: '7',
    title: "Task 8",
    completed: false
  },
  {
    userId: 1,
    id: '8',
    title: "Task 9",
    completed: false
  },
];



const mocks = {
  Query: () => ({
    getTasks: () => tasks.map(task => ({ ...task })),
  }),
};

async function startApolloServer() {
  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs }),
      mocks,
    }),
  });
  const { url } = await startStandaloneServer(server);

  console.log(`
      🚀  Server is running
      📭  Query at ${url}
    `);
}

startApolloServer();