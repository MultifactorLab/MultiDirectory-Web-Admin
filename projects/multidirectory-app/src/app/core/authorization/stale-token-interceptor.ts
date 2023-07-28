import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, retry, switchMap, tap, throwError } from "rxjs";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";

@Injectable()
export class StaleTokenInterceptor implements HttpInterceptor {
    constructor(private api: MultidirectoryApiService) {}

    exceptUrl = [
        'auth/token/get'
    ];
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe( 
             catchError((err: HttpErrorResponse) => {
                if(err.status !== 401) {
                    throw err;
                }
                return this.api.refresh().pipe(
                    switchMap(token => {
                        localStorage.setItem('access_token', token.access_token);
                        localStorage.setItem('refresh_token', token.refresh_token);
                        const modifiedReq = req.clone({ 
                            headers: req.headers.set('Authorization', `Bearer ${token.access_token}`),
                          });
                        return next.handle(modifiedReq)
                    })
                );
             })
        ); 
    }
}

/**
 * 
 *     if (err instanceof HttpErrorResponse) {
                    if (err.status == 401 && !this.exceptUrl.some(url => err.url?.includes(url))) {
                        return this.api.refresh().pipe(
                            switchMap(response => {
                                localStorage.setItem('access_token', response.access_token);
                                localStorage.setItem('refresh_token', response.refresh_token);
                                req.headers.set('Authorization', `Bearer ${response.access_token}`);
                                return throwError(() => new HttpErrorResponse({
                                    status: 401
                                }));  
                            })
                        );
                    }
                }    
 */