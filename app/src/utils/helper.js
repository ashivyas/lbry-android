import { NavigationActions, StackActions } from 'react-navigation';
import Constants from '../constants';

function getRouteForSpecialUri(uri) {
  let targetRoute;
  const page = uri.substring(8).trim(); // 'lbry://?'.length == 8

  switch (page) {
    case Constants.PAGE_REWARDS: targetRoute = 'Rewards'; break;
    case Constants.PAGE_SETTINGS: targetRoute = 'Settings'; break;
    case Constants.PAGE_TRENDING: targetRoute = 'TrendingStack'; break;
    case Constants.PAGE_WALLET: targetRoute = 'WalletStack'; break;
    default: targetRoute = 'DiscoverStack'; break;
  }

  return targetRoute;
}

export function dispatchNavigateToUri(dispatch, nav, uri) {
  if (uri.startsWith('lbry://?')) {
    dispatch(NavigationActions.navigate({ routeName: getRouteForSpecialUri(uri) }));
    return;
  }

  const params = { uri };
  if (nav && nav.routes && nav.routes.length > 0 && 'Main' === nav.routes[0].routeName) {
    const mainRoute = nav.routes[0];
    const discoverRoute = mainRoute.routes[0];
    if (discoverRoute.index > 0 && 'File' === discoverRoute.routes[discoverRoute.index].routeName) {
      const fileRoute = discoverRoute.routes[discoverRoute.index];
      // Currently on a file page, so we can ignore (if the URI is the same) or replace (different URIs)
      if (uri !== fileRoute.params.uri) {
        const stackAction = StackActions.replace({ routeName: 'File', newKey: uri, params });
        dispatch(stackAction);
        return;
      }
    }
  }

  const navigateAction = NavigationActions.navigate({ routeName: 'File', key: uri, params });
  dispatch(navigateAction);
}

export function formatBytes(bytes, decimalPoints = 0) {
  if (!bytes) {
    return '0 KB';
  }

  if (bytes < 1048576) { // < 1MB
    const value = (bytes / 1024.0).toFixed(decimalPoints);
    return `${value} KB`;
  }

  if (bytes < 1073741824) { // < 1GB
    const value = (bytes / (1024.0 * 1024.0)).toFixed(decimalPoints);
    return `${value} MB`;
  }

  const value = (bytes / (1024.0 * 1024.0 * 1024.0)).toFixed(decimalPoints);
  return `${value} GB`;
}

export function navigateToUri(navigation, uri, additionalParams) {
  if (!navigation) {
    return;
  }

  if (uri === navigation.state.key) {
    return;
  }

  if (uri.startsWith('lbry://?')) {
    navigation.navigate({ routeName: getRouteForSpecialUri(uri) });
    return;
  }

  const params = Object.assign({ uri }, additionalParams);
  if ('File' === navigation.state.routeName) {
    const stackAction = StackActions.replace({ routeName: 'File', newKey: uri, params });
    navigation.dispatch(stackAction);
    return;
  }

  navigation.navigate({ routeName: 'File', key: uri, params });
}
