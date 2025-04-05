import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

@NgModule({
  exports: [
    HttpClientModule
  ]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    // Create an http link
    const link = httpLink.create({
      uri: 'https://comp3133-backend-741d7cc3b55a.herokuapp.com/graphql',
    });

    // Create an in-memory cache
    const cache = new InMemoryCache();

    // Initialize Apollo
    apollo.create({
      link,
      cache,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      }
    });
  }
}