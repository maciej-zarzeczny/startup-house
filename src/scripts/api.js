const API_URL = 'https://content.guardianapis.com/search';

export const fetchNews = async (page = 1, section = '', query = '') => {
    // Get prior 30 days date
    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 30));

    // Url parameters parsing
    const fromDateUrl = `?from-date=${priorDate.getFullYear()}-${priorDate.getMonth() + 1}-${priorDate.getDate()}`;
    const sectionUrl = section ? `&section=${section}` : '';
    const queryUrl = query ? `&q=${query}` : '';

    const response = await fetch(API_URL + `${fromDateUrl}&page=${page}${sectionUrl}${queryUrl}&api-key=test`);
    const results = await response.json();

    return { status: response.status, data: results.response };
};
