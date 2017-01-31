var assert = chai.assert;

suite('FetchData', function() {
  test('constructor', function() {
    var fetchData = FetchData();
    assert(fetchData);
    assert(fetchData instanceof FetchData);
  });

  suite('getJSON', function() {
    var xhr, requests;

    setup(function() {
      requests = [];
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = function(req) {
        requests.push(req);
      };
    });

    teardown(function() {
      xhr.restore();
    });

    test('correct URL to getJSON', function() {
      var fetchData = FetchData();
      fetchData.getJSON('/api/nav.json');
      assert.equal(requests[0].url, '/api/nav.json' );
    });

    test('getJSON returns proper data', function() {

      var fetchData = FetchData();
      fetchData.getJSON('/api/nav.json', function(){});

      requests[0].respond(
        200, { 'Content-type': 'text/json' },
        JSON.stringify({ results: [ 1, 2, 3 ] })
      );

      assert.deepEqual('{"results":[1,2,3]}', requests[0].response)
    });
  });
});
