/**
 * 摄影作品数据
 * PHOTOGRAPHER - 个人摄影作品网站
 */

// 作品数据类型定义
const PhotoType = {
    LANDSCAPE: 'landscape',
    ARCHITECTURE: 'architecture',
    PORTRAIT: 'portrait',
    URBAN: 'urban',
    MINIMAL: 'minimal',
    STREET: 'street'
};

// 作品分类中文映射
const CategoryNames = {
    [PhotoType.LANDSCAPE]: '风景',
    [PhotoType.ARCHITECTURE]: '建筑',
    [PhotoType.PORTRAIT]: '人像',
    [PhotoType.URBAN]: '城市',
    [PhotoType.MINIMAL]: '极简',
    [PhotoType.STREET]: '街拍'
};

// 摄影作品数据
const photos = [
    // 风景类作品
    {
        id: '1',
        title: 'Silent Horizon',
        category: PhotoType.LANDSCAPE,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
        description: '宁静的地平线，捕捉大自然的静谧之美'
    },
    {
        id: '2',
        title: 'Mountain Mist',
        category: PhotoType.LANDSCAPE,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600',
        description: '山间云雾，仙境般的自然景象'
    },
    {
        id: '3',
        title: 'Ocean Waves',
        category: PhotoType.LANDSCAPE,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600',
        description: '海浪拍岸，展现海洋的力量与美丽'
    },
    {
        id: '4',
        title: 'Autumn Forest',
        category: PhotoType.LANDSCAPE,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600',
        description: '秋日森林，金黄色的自然诗篇'
    },
    {
        id: '5',
        title: 'Desert Dunes',
        category: PhotoType.LANDSCAPE,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600',
        description: '沙漠沙丘，光影交织的壮丽景观'
    },
    {
        id: '6',
        title: 'Lake Reflection',
        category: PhotoType.LANDSCAPE,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=1600',
        description: '湖面倒影，如镜般平静的水面'
    },
    
    // 建筑类作品
    {
        id: '7',
        title: 'Modern Architecture',
        category: PhotoType.ARCHITECTURE,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600',
        description: '现代建筑，线条与光影的完美结合'
    },
    {
        id: '8',
        title: 'Urban Geometry',
        category: PhotoType.ARCHITECTURE,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600',
        description: '城市几何，展现建筑的韵律感'
    },
    {
        id: '9',
        title: 'Glass Facade',
        category: PhotoType.ARCHITECTURE,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1493397212122-2b85dba81867?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1493397212122-2b85dba81867?w=1600',
        description: '玻璃幕墙，反射与透明的对话'
    },
    {
        id: '10',
        title: 'Bridge Lines',
        category: PhotoType.ARCHITECTURE,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600',
        description: '桥梁线条，力与美的工程艺术'
    },
    
    // 人像类作品
    {
        id: '11',
        title: 'Portrait in Light',
        category: PhotoType.PORTRAIT,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600',
        description: '光影人像，捕捉瞬间的情感'
    },
    {
        id: '12',
        title: 'Urban Portrait',
        category: PhotoType.PORTRAIT,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600',
        description: '都市人像，城市中的个人故事'
    },
    {
        id: '13',
        title: 'Natural Glow',
        category: PhotoType.PORTRAIT,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1600',
        description: '自然光泽，自然光下的人像之美'
    },
    {
        id: '14',
        title: 'Street Portrait',
        category: PhotoType.PORTRAIT,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1600',
        description: '街头人像，记录真实的生活瞬间'
    },
    
    // 城市类作品
    {
        id: '15',
        title: 'City Lights',
        category: PhotoType.URBAN,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600',
        description: '城市之光，夜幕下的璀璨灯火'
    },
    {
        id: '16',
        title: 'Urban Traffic',
        category: PhotoType.URBAN,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1449824913929-4bce42b8ef2c?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1449824913929-4bce42b8ef2c?w=1600',
        description: '城市交通，流光溢彩的都市脉络'
    },
    {
        id: '17',
        title: 'Skyscrapers',
        category: PhotoType.URBAN,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600',
        description: '摩天大楼，现代都市的天际线'
    },
    {
        id: '18',
        title: 'Night City',
        category: PhotoType.URBAN,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600',
        description: '夜之城，霓虹灯下的都市风情'
    },
    
    // 极简类作品
    {
        id: '19',
        title: 'Minimal Lines',
        category: PhotoType.MINIMAL,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1600',
        description: '极简线条，减法美学的极致表达'
    },
    {
        id: '20',
        title: 'White Space',
        category: PhotoType.MINIMAL,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507643179173-617d654fba26?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1507643179173-617d654fba26?w=1600',
        description: '留白艺术，空间与呼吸的美感'
    },
    {
        id: '21',
        title: 'Simple Forms',
        category: PhotoType.MINIMAL,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600',
        description: '简单形态，纯粹的几何之美'
    },
    {
        id: '22',
        title: 'Shadow Play',
        category: PhotoType.MINIMAL,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d9?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d9?w=1600',
        description: '光影游戏，明暗对比的诗意'
    },
    {
        id: '23',
        title: 'Monochrome',
        category: PhotoType.MINIMAL,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?w=1600',
        description: '单色世界，黑白灰的纯净表达'
    },
    
    // 街拍类作品
    {
        id: '24',
        title: 'Street Life',
        category: PhotoType.STREET,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1444723121867-c61e74e36faa?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1444723121867-c61e74e36faa?w=1600',
        description: '街头生活，城市脉搏的真实记录'
    },
    {
        id: '25',
        title: 'Urban Stories',
        category: PhotoType.STREET,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1519111887837-a48ccf9edc00?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1519111887837-a48ccf9edc00?w=1600',
        description: '城市故事，街头巷尾的人生百态'
    },
    {
        id: '26',
        title: 'Street Market',
        category: PhotoType.STREET,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1600',
        description: '街市风情，热闹非凡的市井生活'
    },
    {
        id: '27',
        title: 'Night Walk',
        category: PhotoType.STREET,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600',
        description: '夜游，灯火阑珊的都市漫步'
    },
    {
        id: '28',
        title: 'Subway Stories',
        category: PhotoType.STREET,
        year: 2022,
        thumbnailUrl: 'https://images.unsplash.com/photo-1520108691021-767724d47a6c?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1520108691021-767724d47a6c?w=1600',
        description: '地铁故事，地下铁的众生相'
    },
    {
        id: '29',
        title: 'Urban Details',
        category: PhotoType.STREET,
        year: 2023,
        thumbnailUrl: 'https://images.unsplash.com/photo-1521673469226-2d65044310c8?w=800',
        imageUrl: 'https://images.unsplash.com/photo-1521673469226-2d65044310c8?w=1600',
        description: '城市细节，发现被忽视的美好'
    }
];

// 导出数据（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { photos, PhotoType, CategoryNames };
}
