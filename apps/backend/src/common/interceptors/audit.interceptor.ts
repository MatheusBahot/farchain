import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AUDIT');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const usuario = request.user;
    const inicio = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duracao = Date.now() - inicio;
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            this.logger.log(
              JSON.stringify({
                method,
                url,
                ip,
                usuarioId: usuario?.id,
                duracao: `${duracao}ms`,
                userAgent: headers['user-agent'],
              }),
            );
          }
        },
        error: (err) => {
          const duracao = Date.now() - inicio;
          this.logger.error(
            JSON.stringify({
              method,
              url,
              ip,
              usuarioId: usuario?.id,
              duracao: `${duracao}ms`,
              erro: err.message,
            }),
          );
        },
      }),
    );
  }
}
