import React, { useState } from 'react';
import SEO from '../../components/SEO';
import Description from '../components/Description';
import PhotoGrid from './components/PhotoGrid';

export default function LikePhotoApp() {
    // Dummy data
    const initialPhotos = [
        {
            id: 1,
            title: "accusamus beatae ad facilis cum similique qui sunt",
            url: "https://picsum.photos/seed/1/300/400",
            alt: "accusamus beatae ad facilis cum similique qui sunt",
            likes: 100
        },
        {
            id: 2,
            title: "reprehenderit est deserunt velit ipsam",
            url: "https://picsum.photos/seed/2/300/300",
            alt: "reprehenderit est deserunt velit ipsam",
            likes: 132
        },
        {
            id: 3,
            title: "officia porro iure quia iusto qui ipsa ut modi",
            url: "https://picsum.photos/seed/3/300/500",
            alt: "officia porro iure quia iusto qui ipsa ut modi",
            likes: 224
        },
        {
            id: 4,
            title: "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
            url: "https://picsum.photos/seed/4/300/350",
            alt: "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
            likes: 634
        },
        {
            id: 5,
            title: "natus nisi omnis corporis facere molestiae rerum in",
            url: "https://picsum.photos/seed/5/300/450",
            alt: "natus nisi omnis corporis facere molestiae rerum in",
            likes: 89
        },
        {
            id: 6,
            title: "accusamus ea aliquid et amet sequi nemo",
            url: "https://picsum.photos/seed/6/300/320",
            alt: "accusamus ea aliquid et amet sequi nemo",
            likes: 156
        },
        {
            id: 7,
            title: "officia delectus consequatur vero aut veniam explicabo molestias",
            url: "https://picsum.photos/seed/7/300/480",
            alt: "officia delectus consequatur vero aut veniam explicabo molestias",
            likes: 342
        },
        {
            id: 8,
            title: "aut porro officiis laborum odit ea laudantium corporis",
            url: "https://picsum.photos/seed/8/300/380",
            alt: "aut porro officiis laborum odit ea laudantium corporis",
            likes: 267
        },
        {
            id: 9,
            title: "qui eius qui autem sed",
            url: "https://picsum.photos/seed/9/300/420",
            alt: "qui eius qui autem sed",
            likes: 198
        },
        {
            id: 10,
            title: "beatae et provident et ut vel",
            url: "https://picsum.photos/seed/10/300/360",
            alt: "beatae et provident et ut vel",
            likes: 445
        },
        {
            id: 11,
            title: "nihil at amet non hic quia qui",
            url: "https://picsum.photos/seed/11/300/400",
            alt: "nihil at amet non hic quia qui",
            likes: 123
        },
        {
            id: 12,
            title: "mollitia soluta ut rerum eos aliquam consequatur perspiciatis maiores",
            url: "https://picsum.photos/seed/12/300/440",
            alt: "mollitia soluta ut rerum eos aliquam consequatur perspiciatis maiores",
            likes: 289
        },
        {
            id: 13,
            title: "repudiandae veritatis recusandae quidem tenetur impedit",
            url: "https://picsum.photos/seed/13/300/370",
            alt: "repudiandae veritatis recusandae quidem tenetur impedit",
            likes: 178
        },
        {
            id: 14,
            title: "est voluptatem laborum et distinctio",
            url: "https://picsum.photos/seed/14/300/410",
            alt: "est voluptatem laborum et distinctio",
            likes: 312
        },
        {
            id: 15,
            title: "et dicta animi est alias qui",
            url: "https://picsum.photos/seed/15/300/390",
            alt: "et dicta animi est alias qui",
            likes: 234
        }
    ];

    const [photos, setPhotos] = useState(initialPhotos);

    const handleLikesChange = (photoId, newLikes) => {
        setPhotos(prevPhotos => 
            prevPhotos.map(photo => 
                photo.id === photoId 
                    ? { ...photo, likes: newLikes }
                    : photo
            )
        );
    };

    return (
        <div className="container mx-auto px-4">
            <SEO 
                title="Like My Photo" 
                description="Like My Photo" 
                keywords="like my photo, photo, like, react, web development"
                type="website"
                author="Ovidiu Alexandru Pușcaș"
            />
            <Description description={{ text: 'Double-click on images to like them! ❤️', class: 'text-lg pt-4' }} />
            <PhotoGrid photos={photos} onLikesChange={handleLikesChange} />
        </div>
    );
}

