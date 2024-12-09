import {logError} from '../src/utils.js';
import {ajax} from '../src/ajax.js';
import adapterManager from '../src/adapterManager.js';
import {EVENTS} from '../src/constants.js';
import {getRefererInfo} from '../src/refererDetection.js';
import adapter from '../libraries/analyticsAdapter/AnalyticsAdapter.js';

const ADAPTER_CODE = 'uniquest';
const BASE_URL = 'https://rcvp.ust-ad.com/';
const AUCTION_END_URI = 'pbaae';
const AD_RENDERED_URI = 'pbaars';

function sendEvent(event, uri) {
  ajax(
    BASE_URL + uri,
    null,
    JSON.stringify(event)
  );
}

function adRenderSucceededHandler(eventType, args) {
  const event = {
    event_type: eventType,
    url: args.page_url,
    bid: {
      auction_id: args.bid?.auctionId,
      creative_id: args.bid?.creativeId,
      bidder: args.bid?.bidderCode,
      media_type: args.bid?.mediaType,
      size: args.bid?.size,
      cpm: String(args.bid?.cpm),
      ad_unit_code: args.bid?.adUnitCode
    }
  };
  sendEvent(event, AD_RENDERED_URI);
}

function auctionEndHandler(eventType, args) {
  if (args.bidsReceived.length > 0) {
    const event = {
      event_type: eventType,
      url: args.page_url,
      bids: args.bidsReceived?.map(br => ({
        auction_id: br?.auctionId,
        creative_id: br?.creativeId,
        bidder: br?.bidder,
        media_type: br?.mediaType,
        size: br?.size,
        cpm: String(br?.cpm),
        ad_unit_code: br?.adUnitCode
      }))
    };
    sendEvent(event, AUCTION_END_URI);
  }
}

let baseAdapter = adapter({analyticsType: 'endpoint'});
let uniquestAdapter = Object.assign({}, baseAdapter, {

  enableAnalytics(config = {}) {
    if (config.options && config.options.sid) {
      baseAdapter.enableAnalytics.call(this, config);
    } else {
      logError('Config not found');
      logError('Analytics is disabled due to error(s)');
    }
  },

  disableAnalytics() {
    baseAdapter.disableAnalytics.apply(this, arguments);
  },

  track({eventType, args}) {
    const refererInfo = getRefererInfo();
    args.page_url = refererInfo.page;

    switch (eventType) {
      case EVENTS.AD_RENDER_SUCCEEDED:
        adRenderSucceededHandler(eventType, args);
        break;
      case EVENTS.AUCTION_END:
        auctionEndHandler(eventType, args);
        break;
    }
  }
});

adapterManager.registerAnalyticsAdapter({
  adapter: uniquestAdapter,
  code: ADAPTER_CODE
});

export default uniquestAdapter;
