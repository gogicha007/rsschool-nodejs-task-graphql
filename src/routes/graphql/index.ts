import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, Schema } from './schemas.js';
import { graphql, validate, GraphQLArgs, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const gqlErrs = validate( Schema, parse( req.body.query ), [depthLimit(5)], { maxErrors: 1 } );
      if ( gqlErrs.length > 0 ) {
         return { errors: gqlErrs };
      }
      const gqlArgs:GraphQLArgs = {schema: Schema, source: req.body.query, contextValue: { prisma: prisma } };
      if ( req.body.variables) {
        gqlArgs.variableValues = req.body.variables;
      }
      try {
        const result = await graphql(gqlArgs);
        return result;
      } catch (error) {
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
