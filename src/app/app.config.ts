import { ApplicationConfig, provideZoneChangeDetection, inject, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
 
      return {
        link: httpLink.create({ uri: 'https://comp3133-backend-741d7cc3b55a.herokuapp.com/graphql' }),
        cache: new InMemoryCache(),
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
      };
    })
  ]
};