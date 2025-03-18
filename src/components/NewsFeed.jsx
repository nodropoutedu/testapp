import React, { useState, useEffect, useMemo, useRef } from 'react';
import './NewsFeed.css';

function NewsFeed() {
  const initialArticles = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1569285645462-a3f9c6332d56?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3DD',
      title: "Trump's 'America First' policies are boosting stock markets overseas",
      source: 'NBC News',
      date: '16 Mar 2025',
      imageSource: 'NBC News',
      summary:
        'European stocks are seeing their strongest start to any year since 1998, and international stocks overall are outperforming their American counterparts by more than any year since 1990, according to data JPMorgan Asset Management Chief Market Strategist Gabriela Santos shared with NBC News. This trend highlights the global impact of U.S. economic policies, with analysts noting a significant shift in investment patterns. The data suggests a robust recovery in international markets, driven by optimism around trade policies. Additional details include market analyses and expert opinions on future trends, which are expected to shape global finance in the coming years.',
      link: 'https://www.nbcnews.com',
      bookmarked: false,
      categories: ['Economy', 'Politics'],
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1583429891508-015ef9cd958e?q=80&w=1426&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Nearly Everyone in Bangladesh Gained Access to Basic Electricity',
      source: 'Good News Network',
      date: '16 Mar 2025',
      imageSource: 'Good News Network',
      summary:
        'Coupled with the rapid electrification has been one of the greatest single declines in the poverty rate of a nation ever seen, falling from 44.2% in 1991 to 18.7% in 2022. In 1991, only 14% of the nation had access to electricity. By 2021, 99% had access. This remarkable achievement is attributed to government initiatives and international support, transforming lives and boosting economic growth across rural areas. Further improvements are planned to enhance infrastructure.',
      link: 'https://www.goodnewsnetwork.org',
      bookmarked: false,
      categories: ['Environment', 'Development'],
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1698683412065-1e2e2f36959c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Deepfake Detector Inspects Pixels to Uncover Falsehoods on Your Phone',
      source: 'Good News Network',
      date: '16 Mar 2025',
      imageSource: 'Good News Network',
      summary:
        'A new deepfake detector app analyzes pixel patterns to identify manipulated videos and images directly on your phone. Developed by a team of AI experts, this technology promises to combat misinformation by providing real-time analysis. The app uses advanced machine learning algorithms, making it accessible to the average user. Early tests show an accuracy rate of over 95%, offering hope against the spread of fake content online. Future updates will enhance detection capabilities.',
      link: 'https://www.goodnewsnetwork.org',
      bookmarked: false,
      categories: ['Technology', 'Security'],
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1698683412065-1e2e2f36959c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Deepfake Detector Inspects Pixels to Uncover Falsehoods on Your Phone',
      source: 'Good News Network',
      date: '16 Mar 2025',
      imageSource: 'Good News Network',
      summary:
        'A new deepfake detector app analyzes pixel patterns to identify manipulated videos and images directly on your phone. Developed by a team of AI experts, this technology promises to combat misinformation by providing real-time analysis. The app uses advanced machine learning algorithms, making it accessible to the average user. Early tests show an accuracy rate of over 95%, offering hope against the spread of fake content online. Future updates will enhance detection capabilities.',
      link: 'https://www.goodnewsnetwork.org',
      bookmarked: false,
      categories: ['Technology', 'Security'],
    },
  ];

  const now = new Date('2025-03-17T12:00:00Z');
  const fiftySixHoursAgo = new Date(now.getTime() - 56 * 60 * 60 * 1000);
  const filteredByDate = initialArticles.filter((article) => {
    const articleDate = new Date(article.date);
    return articleDate >= fiftySixHoursAgo;
  });

  const [newsArticles, setNewsArticles] = useState(filteredByDate);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([
    'Economy',
    'Politics',
    'Technology',
    'Security',
    'Environment',
    'Development',
  ]);

  const articlesContainerRef = useRef(null);

  const toggleBookmark = (id) => {
    setNewsArticles(
      newsArticles.map((article) =>
        article.id === id ? { ...article, bookmarked: !article.bookmarked } : article
      )
    );
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.link,
        });
        console.log('Article shared successfully');
      } catch (error) {
        console.error('Error sharing article:', error);
      }
    } else {
      alert('Sharing is not supported on this device. Link copied to clipboard!');
      navigator.clipboard.writeText(article.link);
    }
  };

  const handleNewsRefresh = () => {
    setNewsArticles([...newsArticles]);
    console.log('News feed refreshed');
  };

  const handleSummaryClick = (article) => {
    window.open(article.link, '_blank');
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      console.log('Selected Categories:', newCategories);
      return newCategories;
    });
  };

  const handleSelectAll = () => {
    const allCategories = [
      'Economy',
      'Politics',
      'Technology',
      'Security',
      'Environment',
      'Development',
    ];
    setSelectedCategories((prev) => {
      const newCategories = prev.length === allCategories.length ? [] : allCategories;
      console.log('Select All - Selected Categories:', newCategories);

      setTimeout(() => {
        if (articlesContainerRef.current) {
          articlesContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 0);

      return newCategories;
    });
  };

  const filteredArticles = useMemo(() => {
    console.log('Computing filtered articles with selectedCategories:', selectedCategories);
    return newsArticles.filter((article) => {
      if (selectedCategories.length === 0) {
        console.log(`Article ${article.id} shown (no categories selected)`);
        return true;
      }
      const matches = article.categories.some((category) =>
        selectedCategories.includes(category)
      );
      console.log(`Article ${article.id} Categories:`, article.categories, 'Selected Categories:', selectedCategories, 'Matches:', matches);
      return matches;
    });
  }, [newsArticles, selectedCategories]);

  useEffect(() => {
    console.log('Filtered Articles:', filteredArticles);
    console.log('Filtered Articles Length:', filteredArticles.length);
  }, [filteredArticles]);

  const handleClickOutside = (event) => {
    if (showFilter && !event.target.closest('.filter-popup') && !event.target.closest('.filter-icon')) {
      setShowFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

  function truncateSummary(text) {
    const words = text.split(' ');
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return text + '...';
  }

  return (
    <>
      <div className="image-section">
        <div className="app-logo">
          <img src="https://github.com/aljubaiarde/portfolio/blob/main/Just__4_-removebg-preview.png?raw=true" alt="JustGood Logo" />
        </div>
        <div className="filter-icon" onClick={toggleFilter}>
          🔍
        </div>
        <div className={`filter-popup ${showFilter ? 'active' : ''}`}>
          <div className="filter-content">
            <h3>Filter by Category</h3>
            <div className="close-button" onClick={toggleFilter}>
              ✖
            </div>
            <label>
              <input
                type="checkbox"
                checked={selectedCategories.length === 6}
                onChange={handleSelectAll}
              />
              Select All
            </label>
            <label>
              <input
                type="checkbox"
                value="Economy"
                checked={selectedCategories.includes('Economy')}
                onChange={() => handleCategoryChange('Economy')}
              />
              Economy
            </label>
            <label>
              <input
                type="checkbox"
                value="Politics"
                checked={selectedCategories.includes('Politics')}
                onChange={() => handleCategoryChange('Politics')}
              />
              Politics
            </label>
            <label>
              <input
                type="checkbox"
                value="Technology"
                checked={selectedCategories.includes('Technology')}
                onChange={() => handleCategoryChange('Technology')}
              />
              Technology
            </label>
            <label>
              <input
                type="checkbox"
                value="Security"
                checked={selectedCategories.includes('Security')}
                onChange={() => handleCategoryChange('Security')}
              />
              Security
            </label>
            <label>
              <input
                type="checkbox"
                value="Environment"
                checked={selectedCategories.includes('Environment')}
                onChange={() => handleCategoryChange('Environment')}
              />
              Environment
            </label>
            <label>
              <input
                type="checkbox"
                value="Development"
                checked={selectedCategories.includes('Development')}
                onChange={() => handleCategoryChange('Development')}
              />
              Development
            </label>
          </div>
        </div>
      </div>

      <div className="articles-container" ref={articlesContainerRef}>
        {filteredArticles ? (
          filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="article-container">
                <div className="article-image-section">
                  <div className="publication-date">{article.date}</div>
                  <div className="image-source">{article.imageSource}</div>
                  <img src={article.imageUrl} alt="News" className="news-image" />
                </div>
                <div className="content-section">
                  <h2 className="news-title">{article.title}</h2>
                  <div className="source-and-icons">
                    <p className="news-source">{article.source}</p>
                    <div className="icons">
                      <span
                        className={`bookmark-icon ${article.bookmarked ? 'bookmarked' : ''}`}
                        onClick={() => toggleBookmark(article.id)}
                        style={{ color: article.bookmarked ? '#ff0000' : 'inherit' }}
                      >
                        {article.bookmarked ? '🤍' : '♥'}
                      </span>
                      <span className="share-icon" onClick={() => handleShare(article)}>
                        ↗
                      </span>
                    </div>
                  </div>
                  <p
                    className="news-summary"
                    onClick={() => handleSummaryClick(article)}
                  >
                    {truncateSummary(article.summary)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-articles">No articles match the selected categories.</div>
          )
        ) : (
          <div className="no-articles">Error loading articles. Please try again.</div>
        )}
      </div>
    </>
  );
}

export default NewsFeed;