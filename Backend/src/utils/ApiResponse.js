class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.success = true;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
