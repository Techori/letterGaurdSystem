
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, CheckCircle, Zap, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const features = [
    {
      icon: Shield,
      title: "Secure Verification",
      description: "Advanced security measures ensure document authenticity and prevent fraud.",
      color: "text-primary"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get verification results in seconds with our lightning-fast processing system.",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Admin Control",
      description: "Comprehensive admin dashboard for complete document lifecycle management.",
      color: "text-blue-600"
    },
    {
      icon: Award,
      title: "Trusted System",
      description: "Industry-standard security protocols ensure maximum reliability and trust.",
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo & Title */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 bg-saffron-gradient rounded-2xl animate-pulse-hover">
                <FileText className="h-12 w-12 text-black" />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SecureDoc
                </h1>
                <p className="text-xl text-muted-foreground">Document Verification Portal</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Verify Official Documents
                <span className="block text-primary">Instantly & Securely</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our advanced document verification system ensures authenticity and prevents fraud 
                with military-grade security and instant results.
              </p>

              <div className="flex items-center justify-center gap-2 pt-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  100% Secure
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Instant Verification
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Fraud Prevention
                </Badge>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/verify">
                <Button 
                  size="lg" 
                  className="bg-saffron-gradient hover:opacity-90 text-black font-semibold px-8 py-4 text-lg hover-glow hover-lift animate-pulse-hover"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Verify Document Now
                </Button>
              </Link>
              
              <Link to="/admin">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg hover-lift"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl font-bold mb-4">Why Choose SecureDoc?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology and security features that ensure document integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-effect hover-lift animate-fade-in border-primary/10 bg-card/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className={`inline-flex p-3 rounded-xl bg-primary/10 mx-auto mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Trusted by Thousands</h3>
            <p className="text-xl text-muted-foreground">
              Join the organizations that trust SecureDoc for their document verification needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Documents Verified</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">System Availability</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Card className="glass-effect border-primary/20 max-w-4xl mx-auto animate-fade-in">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-6">
                Ready to Secure Your Documents?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start verifying documents today with our advanced security system. 
                Join thousands of organizations that trust SecureDoc.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/verify">
                  <Button 
                    size="lg" 
                    className="bg-saffron-gradient hover:opacity-90 text-black font-semibold px-8 py-4 hover-glow hover-lift"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Start Verification
                  </Button>
                </Link>
                
                <Link to="/admin">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary/30 hover:bg-primary/10 px-8 py-4 hover-lift"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Access Admin Panel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-primary/20 py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-saffron-gradient rounded-lg">
              <FileText className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-primary">SecureDoc</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 SecureDoc. Advanced Document Verification System.
          </p>
        </div>
      </footer>
    </div>
  );
}
