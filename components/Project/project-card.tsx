"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useState, useEffect, useRef } from "react";
import { Chip } from "@heroui/react";
import { useTranslation } from "@/hooks/useTranslation";

export interface ImageItem {
  url: string | StaticImageData;
  description?: string;
  descriptionKey?: string;
  alt?: string;
  altKey?: string;
}

export interface ProjectProps {
  id?: string;
  titleKey: string;
  descriptionKey: string;
  title?: string;
  description?: string;
  image?: string | StaticImageData;
  images?: ImageItem[];
  embed?: string;
  link?: string;
  tags?: string[];
  imagePosition?: 'left' | 'right';
}

function ImageCarousel({ 
  images, 
  title, 
  onImageClick 
}: { 
  images: ImageItem[]; 
  title: string; 
  onImageClick: (img: ImageItem) => void;
}) {
  const { t } = useTranslation("projects");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, images.length]);

  return (
    <div 
      className="relative w-full h-64 overflow-hidden rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <div 
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 cursor-pointer ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => onImageClick(img)}
          >
            <Image 
              src={img.url} 
              alt={img.alt || (img.altKey ? t(img.altKey, "") : `${title} - image ${index + 1}`)} 
              fill 
              quality={90}
              priority={index === 0}
              className="object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
      
      <button 
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button 
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleDotClick(index);
            }}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ProjectCard({ 
  title, 
  description, 
  image, 
  images = [],
  embed, 
  link, 
  tags,
  imagePosition = 'left' 
}: ProjectProps) {
  const { t } = useTranslation("projects");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = images.length > 0 
    ? images 
    : image 
      ? [{ url: image, alt: title }] 
      : [];
  
  const handleImageClick = (img: ImageItem) => {
    const index = allImages.findIndex(image => 
      image.url === img.url
    );
    setCurrentImageIndex(index >= 0 ? index : 0);
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const goToNextImage = () => {
    if (allImages.length <= 1) return;
    
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(allImages[nextIndex]);
  };
  
  const goToPreviousImage = () => {
    if (allImages.length <= 1) return;
    
    const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(allImages[prevIndex]);
  };

  const mediaContent = allImages.length > 0 ? (
    allImages.length === 1 ? (
      <div 
        className="relative w-full h-64 overflow-hidden rounded-lg cursor-pointer"
        onClick={() => handleImageClick(allImages[0])}
      >
        <Image 
          src={allImages[0].url} 
          alt={allImages[0].alt || (allImages[0].altKey ? t(allImages[0].altKey, "") : title || "")} 
          fill 
          quality={90}
          priority
          className="object-cover hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ) : (
      <ImageCarousel 
        images={allImages} 
        title={title || ""} 
        onImageClick={handleImageClick}
      />
    )
  ) : embed ? (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      <iframe 
        src={embed} 
        className="w-full h-full" 
        allowFullScreen 
        title={title}
      />
    </div>
  ) : null;

  const textContent = (
    <div className="flex flex-col h-full">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        {tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Chip size="sm" key={tag} color="primary" className="text-xs bg-primary/10 text-foreground hover:bg-primary/20 transition-all duration-300">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
      <p className="text-default-600 my-4 flex-grow">{description}</p>
      <div className="flex gap-3">
        {link && (
          <Button 
            as={Link} 
            href={link} 
            color="secondary" 
            variant="shadow" 
            className="w-fit bg-secondary text-white"
            isExternal
          >
            {t("viewProject", "View Project")}
          </Button>
        )}
        {allImages.length > 1 && (
          <Button 
            color="default" 
            variant="light"
            className="w-fit"
            onPress={() => handleImageClick(allImages[0])}
          >
            {t("viewGallery", "View Gallery")}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-content1 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className={`flex flex-col ${imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 p-6`}>
          <div className="md:w-1/2">
            {mediaContent}
          </div>
          <div className="md:w-1/2">
            {textContent}
          </div>
        </div>
      </div>

      {selectedImage && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          placement="center"
          scrollBehavior="inside"
          size="5xl"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedImage.alt || (selectedImage.altKey ? t(selectedImage.altKey, "") : title)} 
                  {allImages.length > 1 && (
                    <span className="text-sm text-default-500">
                      {currentImageIndex + 1} de {allImages.length}
                    </span>
                  )}
                </ModalHeader>
                
                <ModalBody className="relative">
                  {allImages.length > 1 && (
                    <button 
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPreviousImage();
                      }}
                      aria-label="Imagen anterior"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  
                  <div className="relative h-[60vh] w-full">
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.alt || (selectedImage.altKey ? t(selectedImage.altKey, "") : "Project image")}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      quality={100}
                      priority
                    />
                  </div>
                  
                  {allImages.length > 1 && (
                    <button 
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextImage();
                      }}
                      aria-label="Siguiente imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  
                  {selectedImage.description && (
                    <p className="text-default-700 mt-4">{selectedImage.description}</p>
                  )}
                </ModalBody>
                
                <ModalFooter>
                  {allImages.length > 1 && (
                    <div className="flex justify-center w-full gap-2 overflow-auto pb-2">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setSelectedImage(allImages[index]);
                          }}
                          className={`w-14 h-14 relative rounded border-2 overflow-hidden ${
                            index === currentImageIndex 
                              ? 'border-primary'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt || (img.altKey ? t(img.altKey, "") : `Thumbnail ${index + 1}`)}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  <Button 
                    color="primary" 
                    variant="light" 
                    onPress={onClose}
                  >
                    {t("close", "Close")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}