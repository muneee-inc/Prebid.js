# Overview

```
Module Name: UNIQUEST Bid Adapter
Module Type: Bidder Adapter
Maintainer:  prebid_info@muneee.co.jp
```

# Description
Connects to UNIQUEST exchange for bids.

# Test Parameters
```js
var adUnits = [
  // Banner adUnit
  {
    code: 'test-div',
    mediaTypes: {
      banner: {
        sizes: [
          [1, 1],
          [300, 300],
          [300, 250],
          [320, 100]
        ]
      }
    },
    bids: [{
      bidder: 'uniquest',
      params: {
        sid: 'sid_0001',
      }
    }]
  }
];
```
