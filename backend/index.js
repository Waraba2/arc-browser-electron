const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let links = [
  {
    timestamp: "2023-09-28T12:34:56.789Z",
    link: "https://devburst.tech/",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    timestamp: "2023-09-28T12:45:56.789Z",
    link: "https://mui.com/material-ui/",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    timestamp: "2023-09-28T13:00:56.789Z",
    link: "https://arc.net/",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = `
  type Link {
    timestamp: String!
    link: String!
    id: ID!
  }
  
  type Query {
    allLinks: [Link!]!
  }

  type Mutation {
    addLink(
      link: String!
    ): Link

    editLink(
      link: String!
    ):Link
  }
`

const resolvers = {
  Query: {
    allLinks: () => links.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },
  Mutation: {
    addLink: (root, args) => {
      const link = { 
        ...args, 
        id: uuid(),
        timestamp: new Date().toISOString()
      }
      links = links.concat(link)
      return link
    },
    editLink: (root, args) => {
      const link = links.find(l => l.link == args.link)
      if(!link) {
        return null
      }

      const updatedLink = { ...link, link: args.link }
      links = links.map(l => l.link === args.link ? updatedLink : l)
      return updatedLink
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

