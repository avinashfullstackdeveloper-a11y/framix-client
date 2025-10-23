import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating: number) => {
    onRatingChange(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const getStarImage = (starIndex: number) => {
    const currentRating = hoveredRating || rating;
    if (starIndex <= currentRating) {
      return "https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/8a15664ccb86607021e6b835f15e49c1c3673f24?placeholderIfAbsent=true";
    }
    return "https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/9dd9c8da3b2d742c7561174b586cc2821fcb67d2?placeholderIfAbsent=true";
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate your experience";
    }
  };

  return (
    <div className="bg-black border flex min-h-[124px] w-full flex-col items-center mt-8 pt-6 px-6 rounded-[14px] border-[rgba(255,154,201,0.6)] border-solid max-md:max-w-full max-md:px-5">
      <div className="flex items-center gap-8">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            onMouseLeave={handleStarLeave}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[rgba(255,154,201,0.6)] rounded-full"
            aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
            type="button"
          >
            <img
              src={getStarImage(starIndex)}
              alt={`${starIndex} star rating`}
              className="aspect-[1] object-contain w-10 self-stretch shrink-0 my-auto rounded-[22369600px]"
            />
          </button>
        ))}
      </div>
      <div className="text-white text-base font-normal text-center mt-3">
        {getRatingText()}
      </div>
    </div>
  );
};

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const maxCharacters = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === 0) {
      setError('Please select a rating before submitting.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rating, comment: feedback }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to submit feedback.');
      }

      setSuccess(true);
      setRating(0);
      setFeedback('');
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err && 'message' in err
          ? (err as { message?: string }).message
          : 'An error occurred.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFeedback(value);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-6">
      {/* Go Back Button - Top Left */}
      <div className="self-start mb-8">
        <button className="flex items-center gap-3 text-2xl text-white font-semibold hover:text-[rgba(255,154,201,1)] transition-colors" type="button">
          <img
            src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/13c323a2b9d23579e465bf3768ce9d2f6294d148?placeholderIfAbsent=true"
            alt="Back arrow"
            className="aspect-[1] object-contain w-6"
          />
          Go Back
        </button>
      </div>
      
      {/* Centered Content */}
      <div className="flex flex-col items-center w-full max-w-[465px]">
        {success ? (
          <div className="bg-black border flex flex-col items-center justify-center min-h-[200px] w-full rounded-[14px] border-[rgba(255,154,201,0.6)] border-solid p-8 text-white text-xl font-semibold">
            Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl text-white font-semibold leading-tight mb-2">
                How would you rate us?
              </h1>
              <p className="text-base text-white font-normal">
                Rate your experience
              </p>
            </div>
            
            {/* Star Rating - Centered */}
            <div className="w-full">
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>
            
            {/* Feedback Textarea - Centered */}
            <div className="w-full mt-8">
              <div className="bg-black border min-h-[232px] w-full font-normal rounded-[14px] border-[rgba(255,154,201,0.6)] border-solid">
                <div className="bg-black flex min-h-[200px] w-full p-4 rounded-[14px]">
                  <textarea
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Give us your feedback..."
                    className="w-full h-full bg-transparent text-white placeholder-[rgba(153,161,175,1)] resize-none outline-none border-none"
                    maxLength={maxCharacters}
                    aria-label="Feedback textarea"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="text-white text-sm font-semibold mt-3 text-right">
                {feedback.length}/{maxCharacters} characters
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm font-semibold mt-4 text-center w-full">
                {error}
              </div>
            )}

            {/* Submit Button - Centered */}
            <button
              type="submit"
              className="bg-[rgba(235,142,185,1)] flex min-h-12 w-full items-center justify-center text-sm text-black font-semibold leading-none mt-8 px-[13px] py-3.5 rounded-[30px] hover:bg-[rgba(225,132,175,1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(255,154,201,0.6)] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default FeedbackForm;