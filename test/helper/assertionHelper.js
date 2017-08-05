export function assertErrorContainsString(error, string) {
    expect(error.message).toEqual(expect.stringContaining(string));
}
