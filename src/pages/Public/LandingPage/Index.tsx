import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import hero from "@/assets/Gemini_Generated_Image_jvlhfejvlhfejvlh.jpeg";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100svh-7rem)] bg-background">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary animate-fade-in">Welcome To</h2>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"> 
                  Ideal Construction 
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg"> 
                Seamless Transportation for Stronger Foundations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  Join Now
                </Button>
                <Button variant="outline" size="lg" className="hover:bg-primary/5">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img 
                  src={hero} 
                  alt="Construction Equipment" 
                  className="relative rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-[1.01] w-full aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

export const LandingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh_-_4rem)] bg-background animate-pulse">
      <section className="relative py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <Skeleton className="h-12 w-3/4 rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <Skeleton className="w-full aspect-video rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
