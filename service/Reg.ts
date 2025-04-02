export function regLowerEngNum(value: string) {
  // 정규식: 6~12자리, 영문 또는 숫자 또는 영문+숫자
  const regex = /^[a-z0-9]{6,12}$/;

  // 조건에 맞는지 테스트
  return regex.test(value);
}

export function regEngNumChar(value: string) {
  const regex =
/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[*.!@^])[a-zA-Z\d*.!@^]{8,14}$/
  return regex.test(value);
}
