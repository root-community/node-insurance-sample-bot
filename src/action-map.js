const root = require('./root');

const coverPeriodMap = new Map([
  ['1 year', '1_year'],
  ['2 years', '2_years'],
  ['5 years', '5_years'],
  ['10 years', '10_years'],
  ['15 years', '15_years'],
  ['20 years', '20_years'],
  ['whole life', 'whole_life']
]);

/**
 * Retrieve quote details from DialogFlow, and fire these off
 * to the Root API for a quote.
 *
 * We've hardcoded a few values here to make our lives easier.
 */
const makeQuote = async app => {
  const age = app.getArgument('age');
  const basicIncomePerMonth = app.getArgument('income');
  const coverPeriod = app.getArgument('cover-period');
  const gender = app.getArgument('gender');

  const response = await root('/quotes', 'POST', {
    type: 'root_term',
    cover_amount: 10000000, // Remember to work in cents on the API!
    cover_period: mapCoverPeriod(coverPeriod),
    basic_income_per_month: basicIncomePerMonth * 100,
    education_status: 'undergraduate_degree',
    smoker: false,
    gender,
    age: age.amount
  });

  // Quotes come back as an array with potentially more than one
  // quote for the given values. We'll just use the first one to make
  // things easier.
  const quote = response[0];

  // We want to store the selected quote package ID in the DialogFlow
  // context - we'll need this later when we create an application.
  app.setContext('make_quote-followup', 3, {
    quote_package_id: quote.quote_package_id
  });

  app.tell(`Cool! How does R${quote.suggested_premium / 100} sound?`);
};

/**
 * Once we have the quote and policyholder details, we have everything
 * we need to issue a policy. We make 3 calls here:
 *
 * 1) Create a policyholder object using the user's personal details
 * 2) Create an application, passing in the quote package ID we stored
 *    in the DialogFlow context earlier, and the policyholder ID from step 1
 * 3) Issue the policy, passing in the application ID from step 2
 */
const makePolicy = async app => {
  const firstName = app.getArgument('first-name');
  const lastName = app.getArgument('last-name');
  const email = app.getArgument('email');
  const idNumber = app.getArgument('id-number');

  // Get the quote package ID we stored in the context earlier
  const context = app.getContext('make_quote-followup');
  const quotePackageId = context.parameters.quote_package_id;

  const policyholder = await root('/policyholders', 'POST', {
    id: {
      type: 'id',
      number: idNumber,
      country: 'ZA'
    },
    first_name: firstName,
    last_name: lastName,
    email
  });

  const application = await root('/applications', 'POST', {
    quote_package_id: quotePackageId,
    policyholder_id: policyholder.policyholder_id
  });

  const policy = await root('/policies', 'POST', {
    application_id: application.application_id
  });

  app.tell(`Thanks, ${firstName}! I've setup a policy for you - here's your policy number: ${policy.policy_number}`);
};

/**
 * Helper function to map cover periods from DialogFlow to
 * a format used by the Root API (i.e., '1 year' -> '1_year')
 */
const mapCoverPeriod = coverPeriod =>
  coverPeriodMap.has(coverPeriod) ? coverPeriodMap.get(coverPeriod) : '1_year';

module.exports = new Map([
  ['make_quote', makeQuote],
  ['make_policyholder', makePolicy]
]);
