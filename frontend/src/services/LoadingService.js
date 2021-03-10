export default class LoadingService {
  static load(cb) {
    setTimeout(cb, 2500);
  }
}
