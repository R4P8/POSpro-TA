export interface Feature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

export interface Benefit {
  icon: string;
  title: string;
  desc: string;
}