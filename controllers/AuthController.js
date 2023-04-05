class AuthController {
  static getConnect(request, response) {
    const authValue = request.header('Authorization');
    const encodedCredentials = authValue.split(' ')[1];

    return response.status(200).json({ credentials: encodedCredentials});
  }
}

module.exports = AuthController;
