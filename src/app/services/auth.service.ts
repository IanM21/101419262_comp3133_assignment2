import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginInput, SignupInput } from '../models/user';
import { isPlatformBrowser } from '@angular/common';

// GraphQL Login Query
const LOGIN_QUERY = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      _id
      username
      email
      created_at
      updated_at
    }
  }
`;

// GraphQL Signup Mutation
const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      _id
      username
      email
      created_at
      updated_at
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'currentUser';
  private userSubject = new BehaviorSubject<User | null>(null);
  private isBrowser: boolean;
  
  public user$ = this.userSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Check if user is stored in local storage
    if (this.isBrowser) {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(loginInput: LoginInput): Observable<User> {
    return this.apollo.query<{ login: User }>({
      query: LOGIN_QUERY,
      variables: { input: loginInput }
    }).pipe(
      map(result => result.data.login),
      tap(user => {
        if (this.isBrowser) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
        this.userSubject.next(user);
      })
    );
  }

  signup(signupInput: SignupInput): Observable<User> {
    return this.apollo.mutate<{ signup: User }>({
      mutation: SIGNUP_MUTATION,
      variables: { input: signupInput }
    }).pipe(
      map(result => result.data?.signup as User)
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.USER_KEY);
    }
    this.userSubject.next(null);
    this.apollo.client.resetStore();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}