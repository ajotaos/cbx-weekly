export const arn = $interpolate`arn:aws:lambda:${aws.getRegionOutput().name}:094274105915:layer:AWSLambdaPowertoolsTypeScriptV2:12`;
export const externals = ['@aws-lambda-powertools/*'];
