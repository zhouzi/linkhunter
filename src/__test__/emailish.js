import assert from 'assert';
import emailish from '../emailish';

describe('emailish', () => {
  const validEmails = [
    'email@domain.com',
    'email@domain-sub.domain.com',
    'some-email+whatever@domain-sub.domain.whatever'
  ];
  validEmails.forEach(str => {
    it(`should consider ${str} to be a valid email address`, () => {
      assert.equal(emailish(str), true);
    });
  });

  const invalidEmails = [
    'email@domain',
    'someone@domain!com',
    'someone@domain%.com+something',
    'email@domain.thisisawaytoologtopleveldomain'
  ];
  invalidEmails.forEach(str => {
    it(`should consider ${str} to be an invalid email address`, () => {
      assert.equal(emailish(str), false);
    });
  });
});
