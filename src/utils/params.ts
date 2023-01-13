import { createBrowserHistory } from 'history';
import { useState, useEffect } from 'react';
import queryString, { ParsedQuery } from 'query-string';

const history = createBrowserHistory();

export function updateUrlCode(code: string) {
  const { pathname } = history.location;

  const existingQuery = getParamsFromQuery();

  const newQuery = queryString.stringify({
    ...existingQuery,
    code,
  });

  history.replace(`${pathname}#${newQuery}`);
}

export function getParamsFromQuery(location = history.location) {
  try {
    return queryString.parse(location.hash.replace(/^#/, ''));
  } catch (err) {
    return {};
  }
}

export function useParams<ReturnType>(
  selector: (rawParams: ParsedQuery) => ReturnType
): ReturnType {
  const [params, setParams] = useState(getParamsFromQuery);

  useEffect(
    () =>
      history.listen((location) => {
        setParams(getParamsFromQuery(location.location));
      }),
    []
  );

  return selector(params);
}
