export default class Prng {
  constructor(s1=100, s2=999, s3=3999) {
    Object.assign(this, {s1, s2, s3, _firstRun: true});
  }

  nextInt() {
    const {s1, s2, s3} = this;
    this.r = Math.trunc((s1/30269 + s2/30307 + s3/30323 ) * Number.MAX_SAFE_INTEGER);

    this.s1 = 171 * (s1 % 177) - 2  * Math.floor(s1 / 177)
    this.s2 = 172 * (s2 % 176) - 35 * Math.floor(s2 / 176)
    this.s3 = 170 * (s3 % 178) - 63 * Math.floor(s3 / 178)
    return this.r;
  }

}
