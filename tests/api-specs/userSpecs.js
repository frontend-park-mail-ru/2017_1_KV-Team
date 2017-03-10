/* global describe, HTTP, it, expect */
describe('', () => {
  const http = new HTTP();

  it('Метод POST /api/account без параметров возвращает статус 400', (done) => {
    http.post('/api/account', { username: '', password: '' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(400);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/account без имени пользователя возвращает статус 400', (done) => {
    http.post('/api/account', { username: '', password: 'passwd' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(400);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/account без пароля возвращает статус 400', (done) => {
    http.post('/api/account', { username: 'username', password: '' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(400);
        done(true);
      });
  }, 5000);


  it('Метод POST /api/account успешная регистрация', (done) => {
    http.post('/api/account', { username: 'user1', password: 'passwd', email: 'old@mail.ru' })
      .then((responseText) => {
        const status = responseText.code;
        const name = responseText.message;
        expect(status).toBe(200);
        expect(name).toBe('user1');
        done(true);
      });
  }, 5000);

  it('Метод POST /api/account уже существует', (done) => {
    http.post('/api/account', { username: 'user1', password: 'passwd2', email: 'old@mail.ru' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(409);
        done(true);
      });
  }, 5000);


  it('Метод POST /api/account второй пользователь успешно создан', (done) => {
    http.post('/api/account', { username: 'user2', password: 'passwd2', email: 'old@mail.ru' })
      .then((responseText) => {
        const status = responseText.code;
        const name = responseText.message;
        expect(status).toBe(200);
        expect(name).toBe('user2');
        done(true);
      });
  }, 5000);

  it('Метод GET /api/isloggedin сейчас залогинены', (done) => {
    http.get('/api/isloggedin')
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(200);
        done(true);
      });
  }, 5000);

  it('Метод GET /api/logout успешен', (done) => {
    http.get('/api/logout')
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(200);
        done(true);
      });
  }, 5000);

  it('Метод GET /api/logout повторно успешен', (done) => {
    http.get('/api/logout')
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(200);
        done(true);
      });
  }, 5000);

  it('Метод GET /api/isloggedin сейчас залогинены', (done) => {
    http.get('/api/isloggedin')
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(401);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/login пустые данные', (done) => {
    http.post('/api/login', { username: '', password: '' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(400);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/login пустой пароль', (done) => {
    http.post('/api/login', { username: 'user1', password: '' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(400);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/login пустое имя', (done) => {
    http.post('/api/login', { username: '', password: 'passwd' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(400);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/login неподходящие данные', (done) => {
    http.post('/api/login', { username: 'user2', password: 'passwd' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(403);
        done(true);
      });
  }, 5000);

  it('Метод POST /api/login успешный логин', (done) => {
    http.post('/api/login', { username: 'user1', password: 'passwd' })
      .then((responseText) => {
        const status = responseText.code;
        const name = responseText.message;
        expect(status).toBe(200);
        expect(name).toBe('user1');
        done(true);
      });
  }, 5000);

  it('Метод GET /api/account старый email', (done) => {
    http.get('/api/account/user1')
      .then((responseText) => {
        const email = responseText.email;
        expect(email).toBe('old@mail.ru');
        done(true);
      });
  }, 5000);

  it('Метод PUT /api/account изменение email', (done) => {
    http.put('/api/account', { email: 'new@mail.ru' })
      .then((responseText) => {
        const status = responseText.code;
        expect(status).toBe(200);
        done(true);
      });
  }, 5000);

  it('Метод GET /api/account новый email', (done) => {
    http.get('/api/account/user1')
      .then((responseText) => {
        const email = responseText.email;
        expect(email).toBe('new@mail.ru');
        done(true);
      });
  }, 5000);
});
