import axios from 'axios';

// 从环境变量或配置文件中获取
const EMBY_BASE_URL = process.env.REACT_APP_EMBY_SERVER_URL;
const API_KEY = process.env.REACT_APP_EMBY_API_KEY;
const USERNAME = process.env.REACT_APP_EMBY_USERNAME;
const PASSWORD = process.env.REACT_APP_EMBY_PASSWORD;
const DEVICE_ID = 'web-client-' + Math.random().toString(36).substring(7);

class EmbyService {
  constructor() {
    this.token = null;
    this.client = axios.create({
      baseURL: `${EMBY_BASE_URL}/emby`,
      headers: {
        'X-Emby-Authorization': this.getAuthHeader(),
        'Accept': 'application/json'
      }
    });
    
    // 定义分类查询参数
    this.categoryQueries = {
      portrait: {
        searchQuery: {
          SearchTerm: 'person OR face OR portrait OR people',
          ImageTypes: 'Primary',
          Filters: 'HasFace',
          MinWidth: 600,
          SortBy: 'DateCreated',
          SortOrder: 'Descending'
        }
      },
      landscape: {
        searchQuery: {
          SearchTerm: 'landscape OR nature OR scenery OR outdoor',
          ImageTypes: 'Primary',
          MinWidth: 1200,
          MinHeight: 800,
          SortBy: 'DateCreated',
          SortOrder: 'Descending'
        }
      },
      life: {
        searchQuery: {
          SearchTerm: 'life OR daily OR event OR activity',
          ExcludeSearchTerm: 'landscape nature portrait',
          ImageTypes: 'Primary',
          SortBy: 'DateCreated',
          SortOrder: 'Descending'
        }
      },
      all: {
        searchQuery: {
          SortBy: 'DateCreated',
          SortOrder: 'Descending'
        }
      }
    };
    
    // 为每个分类维护独立的照片列表
    this.categoryPhotos = {
      all: [],
      portrait: [],
      landscape: [],
      life: []
    };
  }

  getAuthHeader() {
    return `MediaBrowser Client="Web Client", Device="Browser", DeviceId="${DEVICE_ID}", Version="1.0.0"${this.token ? `, Token="${this.token}"` : ''}`;
  }

  async refreshToken() {
    try {
      const response = await axios.post(`${EMBY_BASE_URL}/emby/Users/AuthenticateByName`, {
        Username: USERNAME,
        Pw: PASSWORD
      }, {
        headers: {
          'X-Emby-Authorization': this.getAuthHeader()
        }
      });

      this.token = response.data.AccessToken;
      
      // 更新客户端的认证头
      this.client.defaults.headers['X-Emby-Authorization'] = this.getAuthHeader();
      
      return this.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  async getPhotos(category = 'all', page = 1, limit = 20, options = {}) {
    try {
      const startIndex = (page - 1) * limit;
      const { sortOrder = 'desc' } = options;

      const queryParams = {
        IncludeItemTypes: 'Photo',
        Recursive: true,
        Fields: 'PrimaryImageAspectRatio,Overview,DateCreated,Width,Height',
        api_key: API_KEY,
        ImageTypeLimit: 1,
        EnableImageTypes: 'Primary',
        Limit: limit,
        StartIndex: startIndex,
        SortBy: 'DateCreated',
        SortOrder: sortOrder === 'desc' ? 'Descending' : 'Ascending'
      };

      if (category !== 'all') {
        // 添加分类特定的查询参数
        Object.assign(queryParams, this.categoryQueries[category]?.searchQuery || {});
      }

      const response = await this.client.get('/Items', { params: queryParams });

      // 检查是否有更多照片
      const totalCount = response.data.TotalRecordCount;
      const hasMore = (startIndex + limit) < totalCount;
      console.log(`Loaded photos ${startIndex + 1}-${startIndex + limit} of ${totalCount}`);

      if (!response?.data?.Items?.length) {
        console.warn(`No photos found for category: ${category}`);
        return { photos: [], totalCount: 0, hasMore: false };
      }

      const photos = response.data.Items.map(photo => ({
        id: photo.Id,
        title: photo.Name,
        description: photo.Overview || '',
        date: new Date(photo.DateCreated).toLocaleDateString(),
        url: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&api_key=${API_KEY}`,
        thumbnail: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=80&fillWidth=400&fillHeight=300&api_key=${API_KEY}`,
        aspectRatio: photo.PrimaryImageAspectRatio || 1.5
      }));

      return {
        photos,
        totalCount,
        hasMore,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      };
    } catch (error) {
      console.error(`Error fetching photos for category ${category}:`, error);
      throw error;
    }
  }

  async fetchPhotos(category) {
    const categoryQueries = {
      portrait: {
        searchQuery: {
          SearchTerm: 'person OR face OR portrait OR people',
          ImageTypes: 'Primary',
          Filters: 'HasFace',
          MinWidth: 600,
          SortBy: 'DateCreated',
          SortOrder: 'Descending',
          Limit: 8
        }
      },
      landscape: {
        searchQuery: {
          SearchTerm: 'landscape OR nature OR scenery OR outdoor',
          ImageTypes: 'Primary',
          MinWidth: 1200,
          MinHeight: 800,
          SortBy: 'DateCreated',
          SortOrder: 'Descending',
          Limit: 8
        }
      },
      life: {
        searchQuery: {
          SearchTerm: 'life OR daily OR event OR activity',
          ExcludeSearchTerm: 'landscape nature portrait',
          ImageTypes: 'Primary',
          SortBy: 'DateCreated',
          SortOrder: 'Descending',
          Limit: 8
        }
      },
      all: {
        searchQuery: {
          SortBy: 'DateCreated',
          SortOrder: 'Descending',
          Limit: 8
        }
      }
    };

    try {
      if (this.categoryPhotos[category]?.length > 0) {
        return {
          photos: this.categoryPhotos[category],
          totalCount: this.categoryPhotos[category].length
        };
      }

      if (!this.token) {
        await this.refreshToken();
      }

      const baseParams = {
        IncludeItemTypes: 'Photo',
        Recursive: true,
        Fields: 'PrimaryImageAspectRatio,Overview,DateCreated,Width,Height',
        api_key: API_KEY,
        ImageTypeLimit: 1,
        EnableImageTypes: 'Primary'
      };

      const queryParams = {
        ...baseParams,
        ...(categoryQueries[category]?.searchQuery || categoryQueries.all.searchQuery)
      };

      const response = await this.client.get('/Items', { params: queryParams });

      if (!response?.data?.Items?.length) {
        console.warn(`No photos found for category: ${category}`);
        return { photos: [], totalCount: 0 };
      }

      const photos = response.data.Items.map(photo => ({
        id: photo.Id,
        title: photo.Name,
        description: photo.Overview || '',
        date: new Date(photo.DateCreated).toLocaleDateString(),
        cover: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&fillWidth=800&fillHeight=600&api_key=${API_KEY}`,
        thumbnail: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=80&fillWidth=400&fillHeight=300&api_key=${API_KEY}`,
        original: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&api_key=${API_KEY}`,
        aspectRatio: photo.PrimaryImageAspectRatio || 1.5
      }));

      // 更新缓存
      this.categoryPhotos[category] = photos;

      return {
        photos,
        totalCount: response.data.TotalRecordCount
      };
    } catch (error) {
      console.error(`Error fetching photos for category ${category}:`, error);
      throw error;
    }
  }

  // 修改刷新方法，使用随机排序获取新照片
  async refreshCategoryPhotos(category) {
    try {
      if (!this.token) {
        await this.refreshToken();
      }

      const queryParams = {
        IncludeItemTypes: 'Photo',
        Recursive: true,
        Fields: 'PrimaryImageAspectRatio,Overview,DateCreated,Width,Height',
        api_key: API_KEY,
        ImageTypeLimit: 1,
        EnableImageTypes: 'Primary',
        Limit: 8,
        SortBy: 'Random',
        StartIndex: Math.floor(Math.random() * 100)
      };

      if (category === 'portrait') {
        Object.assign(queryParams, {
          SearchTerm: 'person OR face OR portrait OR people',
          Filters: 'HasFace',
          MinWidth: 600
        });
      } else if (category === 'landscape') {
        Object.assign(queryParams, {
          SearchTerm: 'landscape OR nature OR scenery OR outdoor',
          MinWidth: 1200,
          MinHeight: 800
        });
      } else if (category === 'life') {
        Object.assign(queryParams, {
          SearchTerm: 'life OR daily OR event OR activity',
          ExcludeSearchTerm: 'landscape nature portrait'
        });
      }

      const response = await this.client.get('/Items', { params: queryParams });

      if (!response?.data?.Items?.length) {
        console.warn(`No photos found for category: ${category}`);
        return { photos: [], totalCount: 0 };
      }

      const photos = response.data.Items.map(photo => ({
        id: photo.Id,
        title: photo.Name,
        description: photo.Overview || '',
        date: new Date(photo.DateCreated).toLocaleDateString(),
        cover: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&fillWidth=800&fillHeight=600&api_key=${API_KEY}`,
        thumbnail: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=80&fillWidth=400&fillHeight=300&api_key=${API_KEY}`,
        original: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&api_key=${API_KEY}`,
        aspectRatio: photo.PrimaryImageAspectRatio || 1.5
      }));

      // 更新缓存
      this.categoryPhotos[category] = photos;

      return {
        photos,
        totalCount: response.data.TotalRecordCount
      };
    } catch (error) {
      console.error(`Error refreshing photos for category ${category}:`, error);
      return { photos: [], totalCount: 0 };
    }
  }

  // 修改刷新所有分类的方法
  async refreshAllPhotos() {
    // 重置所有分类的起始位置
    Object.keys(this.categoryPhotos).forEach(category => {
      this.categoryPhotos[category] = [];
    });
    // 重新获取所有分类的照片
    const categories = ['all', 'portrait', 'landscape', 'life'];
    return Promise.all(categories.map(category => this.getPhotos(category)));
  }
}

export const embyService = new EmbyService();

export const getPhotos = async (category = 'all', page = 1, limit = 20) => {
  try {
    const startIndex = (page - 1) * limit;
    const response = await fetch(
      `${EMBY_BASE_URL}/Items?api_key=${API_KEY}&IncludeItemTypes=Photo&Recursive=true&Fields=PrimaryImageAspectRatio&StartIndex=${startIndex}&Limit=${limit}`
    );
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return {
      photos: data.Items.map(item => ({
        id: item.Id,
        title: item.Name,
        url: `${EMBY_BASE_URL}/Items/${item.Id}/Images/Primary?api_key=${API_KEY}`,
        thumbnail: `${EMBY_BASE_URL}/Items/${item.Id}/Images/Primary?api_key=${API_KEY}&width=400`,
        date: new Date(item.DateCreated).toLocaleDateString(),
        description: item.Overview || '',
        location: item.ProductionLocations?.[0] || ''
      })),
      totalCount: data.TotalRecordCount,
      hasMore: (startIndex + limit) < data.TotalRecordCount
    };
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
}; 